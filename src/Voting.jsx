import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { db } from "./db/FirebaseInit";
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LuExternalLink } from "react-icons/lu";

const Voting = () => {
  const { currentUser } = useAuth();
  const [votingGames, setVotingGames] = useState([]);
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserVoted, setHasUserVoted] = useState(false); // State to track if the user has voted

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "votingStatus"));
        if (settingsDoc.exists()) {
          setIsVotingActive(settingsDoc.data().isVotingActive);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
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

    const checkUserVoted = async () => {
      if (!currentUser) return;

      const userCollection = currentUser.role !== "team" ? "users" : "teams";
      const q = query(
        collection(db, userCollection),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setHasUserVoted(userData.voted || false);
      }
    };

    const loadData = async () => {
      await fetchSettings();
      await fetchVotingGames();
      await checkUserVoted();
      setIsLoading(false);
    };

    loadData();
  }, [currentUser]);

  const handleVote = async (game) => {
    if (!currentUser || !currentUser.name || hasUserVoted) return;

    try {
      const gameRef = doc(db, "voting", game.id);
      await updateDoc(gameRef, {
        votes: arrayUnion(currentUser.name),
      });

      const userCollection = currentUser.role !== "team" ? "users" : "teams";

      const q = query(
        collection(db, userCollection),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, userCollection, userDoc.id);
        await updateDoc(userRef, { voted: true });
        setHasUserVoted(true); // Update state to reflect that the user has voted
      } else {
        console.error("No user found with the specified uid.");
      }

      toast.success(`You have voted for ${game.gameName}!`);
    } catch (error) {
      console.error("Error voting for the game:", error);
      toast.error("Failed to vote for the game");
    }
  };

  if (isLoading)
    return (
      <div className="w-screen h-screen flex justify-center items-center text-xl font-semibold text-slate-500">
        Loading...
      </div>
    );

  if (!isVotingActive) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-xl font-semibold text-slate-500">
        Voting has not started yet.
      </div>
    );
  }

  if (!currentUser) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="space-y-8 p-5 md:p-10">
      <h2 className="text-xl font-semibold mb-4 pt-20">
        Games Available for Voting
      </h2>
      <ul className="bg-white rounded-md shadow-md p-4">
        {votingGames.map((game) => {
          const isUserTeamGame = currentUser.name === game.teamName;

          return (
            <li
              key={game.id}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <div className="flex flex-col justify-center items-start">
                <div className="text-lg md:text-xl font-bold">
                  {game.gameName}
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  {game.teamName}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={`/explore/${game.gameId}`}
                  className="text-blue-500 hover:underline flex gap-2 items-center"
                  target="_blank"
                >
                  Try it out
                  <LuExternalLink />
                </Link>
                <button
                  onClick={() => handleVote(game)}
                  className={`${
                    isUserTeamGame || hasUserVoted
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-4 py-2 rounded-md`}
                  disabled={isUserTeamGame || hasUserVoted}
                >
                  Vote
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Voting;
