import React from "react";
import { useNavigate } from "react-router-dom";
import { RiTeamFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

const GameCard = ({ props }) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/explore/${props.id}`);
      };
  return (
    <div
      key={props.id}
      onClick={handleCardClick}
      className="m-4 p-5 border border-slate-400 rounded-lg shadow-lg w-72 cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
    >
      <div className="w-full p-1 border-2 border-black rounded-lg overflow-hidden">
        <img
          src={props.gamePreview}
          alt={props.gameName}
          className="w-full h-[180px] object-cover rounded-md hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h2 className="text-xl font-semibold mt-2">{props.gameName}</h2>
      <div className="flex items-center text-gray-500 my-1">
        <RiTeamFill className="mr-1" />
        <span>By: {props.teamName}</span>
      </div>
      <div className="flex items-center text-gray-500 my-1">
        <FaHeart className="mr-1" />
        <span>{props.likes.length} Likes</span>
      </div>
      <p className="flex items-center text-gray-500 my-1">
        <FaCalendarAlt />: {props.timestamp.toDate().toLocaleString()}
      </p>
    </div>
  );
};

export default GameCard;
