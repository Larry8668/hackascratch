import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGames } from "./db/FirebaseService";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "./db/FirebaseInit"; // Adjust the path based on your file structure
import GameCard from "./components/GameCard";
import { FaPlus } from "react-icons/fa6";

const Explore = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [settings, setSettings] = useState({
    isVotingActive: false,
    isResultsActive: false,
  });

  useEffect(() => {
    const getGames = async () => {
      const fetchedGames = await fetchGames();
      setGames(fetchedGames);
      setSubmissionCount(fetchedGames.length);
    };

    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "votingStatus"));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    getGames();
    fetchSettings(); // Fetch settings when the component mounts
  }, []);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    const sortedGames = [...games].sort((a, b) => {
      if (option === "Newest") {
        return b.timestamp - a.timestamp;
      } else if (option === "Oldest") {
        return a.timestamp - b.timestamp;
      } else if (option === "Most Likes") {
        return b.likes.length - a.likes.length;
      }
      return 0;
    });

    setGames(sortedGames);
  };

  const getActionButton = () => {
    if (settings.isVotingActive) {
      return (
        <button
          className="text-sm md:text-base p-3 flex items-center gap-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
          onClick={() => navigate("/voting")}
        >
          Vote Now
        </button>
      );
    } else if (settings.isResultsActive) {
      return (
        <button
          className="text-sm md:text-base p-3 flex items-center gap-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600"
          onClick={() => navigate("/results")}
        >
          View Results
        </button>
      );
    }
    return null;
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center text-black">
      <div className="w-full flex justify-between items-start md:items-center p-5 pt-20">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Explore the various submissions
          </h1>
          <p className="text-base md:text-xl text-gray-600">
            Discover amazing games created by our community!
          </p>
        </div>
        <div className="text-base md:text-lg font-semibold flex flex-col md:gap-2 justify-center items-center">
          <div className="text-2xl md:text-4xl font-bold">
            {submissionCount}
          </div>
          <div>Submissions</div>
        </div>
      </div>
      <div className="w-[90%] h-[1px] bg-slate-500" />
      <div className="w-[90%] h-[1px] bg-slate-500 mb-5" />
      <div className="w-full flex justify-between items-center px-5 md:px-16 gap-4">
        <div className="flex md:items-center justify-start gap-4 md:w-1/2">
          <label
            htmlFor="sort"
            className="text-sm md:text-base font-semibold mb-1"
          >
            Sort By:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 p-2 rounded-md w-full md:w-auto"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Most Likes">Most Likes</option>
          </select>
        </div>

        <div className="flex gap-4 md:ml-auto">
          <button
            className="text-sm md:text-base p-3 flex items-center gap-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
            onClick={() => navigate("/upload")}
          >
            Upload Game <FaPlus />
          </button>
          {getActionButton()}
        </div>
      </div>
      {games.length > 0 ? (
        <div className="w-full flex flex-wrap justify-center">
          {games.map((game) => (
            <GameCard key={game.id} props={game} />
          ))}
        </div>
      ) : (
        <div className="text-sm font-semibold text-gray-500 mt-10">
          Get started by uploading your first game!
        </div>
      )}
    </div>
  );
};

export default Explore;
