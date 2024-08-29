import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGames } from "./db/FirebaseService";
import GameCard from "./components/GameCard";
import { FaPlus } from "react-icons/fa6";

const Explore = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const getGames = async () => {
      const fetchedGames = await fetchGames();
      setGames(fetchedGames);
      setSubmissionCount(fetchedGames.length);
    };

    getGames();
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

  return (
    <div className="w-screen flex flex-col justify-center items-center text-black">
      <div className="w-full flex justify-between items-start md:items-center p-5 pt-20">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Explore the various submissions
          </h1>
          <p className="text-base    md:text-xl text-gray-600">
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
      <div className="w-full flex justify-between items-center px-5 gap-4">
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
            <option value="" disabled>Select</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Most Likes">Most Likes</option>
          </select>
        </div>

        <button
          className="p-3 flex items-center gap-2     bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 md:ml-auto md:w-auto"
          onClick={() => navigate("/upload")}
        >
          Upload Game <FaPlus />
        </button>
      </div>
      <div className="w-full flex flex-wrap justify-center md:justify-start">
        {games.map((game) => (
          <GameCard props={game} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
