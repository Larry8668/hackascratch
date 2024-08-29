import React, { useEffect, useState } from "react";
import { fetchGames } from "./db/FirebaseService"; // Import the fetchGames function
import GameCard from "./components/GameCard";

const Explore = () => {
  const [games, setGames] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    const getGames = async () => {
      const fetchedGames = await fetchGames();
      setGames(fetchedGames);
      setSubmissionCount(fetchedGames.length);
    };

    getGames();
  }, []);

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
      <div className="w-full flex flex-wrap justify-center md:justify-start">
        {games.map((game) => (
          <GameCard props={game} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
