import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./db/FirebaseInit";
import { Link } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import { LuExternalLink } from "react-icons/lu";

const ResultsScreen = () => {
  const [votingGames, setVotingGames] = useState([]);
  const [isResultsActive, setIsResultsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "votingStatus"));
        if (settingsDoc.exists()) {
          setIsResultsActive(settingsDoc.data().isResultsActive);
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
        votingList.sort((a, b) => b.votes.length - a.votes.length);
        setVotingGames(votingList);
      } catch (error) {
        console.error("Error fetching voting games:", error);
      }
    };

    const loadData = async () => {
      await fetchSettings();
      await fetchVotingGames();
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-xl font-semibold text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isResultsActive) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-xl font-semibold text-slate-500">
        Results have not been released yet.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-5 md:p-10">
      <h2 className="text-xl font-semibold mb-4 pt-20">Results of Voting</h2>
      <ul className="bg-white rounded-md shadow-md p-4">
        {votingGames.map((game, index) => (
          <li
            key={game.id}
            className="flex justify-between items-center py-2 border-b last:border-b-0"
          >
            <div className="flex flex-col justify-center items-start">
              <div className="text-lg md:text-xl font-bold flex items-center">
                {index === 0 && <FaTrophy className="text-yellow-500 mr-2" />}
                {game.gameName}
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                {game.teamName}
              </div>
              <div className="text-sm text-gray-600">
                Votes: {game.votes.length}
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsScreen;
