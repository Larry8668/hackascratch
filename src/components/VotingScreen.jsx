import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../db/FirebaseInit";
import toast from "react-hot-toast";
import { FaPlus, FaMinus } from "react-icons/fa6";

const VotingScreen = ({ role }) => {
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [votingGames, setVotingGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesSnapshot = await getDocs(collection(db, "games"));
        const gamesList = gamesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGames(gamesList);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    const fetchVotingGames = async () => {
      try {
        const votingSnapshot = await getDocs(collection(db, "voting"));
        const votingList = votingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVotingGames(votingList);
      } catch (error) {
        console.error("Error fetching voting games:", error);
      }
    };

    fetchGames();
    fetchVotingGames();
  }, []);

  const handleSelectGame = async (game) => {
    try {
      const newDocRef = await addDoc(collection(db, "voting"), {
        gameName: game.gameName,
        teamName: game.teamName,
        votes: [],
      });
      // Optimistically update the voting games list
      setVotingGames((prev) => [
        ...prev,
        { id: newDocRef.id, gameName: game.gameName, teamName: game.teamName },
      ]);
      toast.success(`${game.gameName} added to voting list!`);
    } catch (error) {
      console.error("Error adding game to voting:", error);
      toast.error("Failed to add game to voting");
    }
  };

  const handleDeleteGame = async (votingGame) => {
    try {
      await deleteDoc(doc(db, "voting", votingGame.id));
      // Remove game from the voting list locally
      setVotingGames((prev) =>
        prev.filter((game) => game.id !== votingGame.id)
      );
      toast.success(`${votingGame.gameName} removed from voting list!`);
    } catch (error) {
      console.error("Error deleting voting game:", error);
      toast.error("Failed to delete voting game");
    }
  };

  if (!role || role === "team") return null;

  return (
    <div className="space-y-8">
      {role === "admin" && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Select Games for Voting
          </h2>
          <ul className="bg-white rounded-md shadow-md p-4">
            {games.map((game) => {
              const isGameInVoting = votingGames.some(
                (votingGame) =>
                  votingGame.gameName === game.gameName &&
                  votingGame.teamName === game.teamName
              );

              return (
                <li
                  key={game.id}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div>
                    {game.gameName} - {game.teamName}
                  </div>
                  <button
                    className={`${
                      isGameInVoting ? "bg-gray-500" : "bg-blue-500"
                    } text-white px-4 py-2 rounded-md`}
                    onClick={() => handleSelectGame(game)}
                    disabled={isGameInVoting}
                  >
                    <FaPlus />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div>
        <h2 className="text-xl font-semibold my-4">
          Games Selected for Voting
        </h2>
        <ul className="bg-white rounded-md shadow-md p-4">
          {votingGames.map((votingGame) => (
            <li
              key={votingGame.id}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <div>
                {votingGame.gameName} - {votingGame.teamName}
              </div>
              {role && role == "admin" && (
                <button
                  onClick={() => handleDeleteGame(votingGame)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  <FaMinus />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VotingScreen;
