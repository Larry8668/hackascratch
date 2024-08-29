import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { db } from "./db/FirebaseInit";
import { likeGame, addCommentToGame } from "./db/FirebaseService";
import { doc, getDoc } from "firebase/firestore";
import { MdAccountCircle } from "react-icons/md";
import { useAuth } from "./context/AuthContext";
import toast from "react-hot-toast";

const GamePage = () => {
  const { currentUser } = useAuth();
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const gameRef = doc(db, "games", gameId);
        const gameSnap = await getDoc(gameRef);

        if (gameSnap.exists()) {
          setGame({ id: gameSnap.id, ...gameSnap.data() });
        } else {
          console.error("No such game found!");
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like!");
      return;
    }
    if (!game) return;
    try {
      await likeGame(game.id, currentUser.name);
      setGame((prev) => ({
        ...prev,
        likes: [...prev.likes, currentUser.name],
      }));
    } catch (error) {
      console.error("Error liking the game:", error);
    }
  };

  const handleAddComment = async () => {
    if (!currentUser) {
      toast.error("Please login to comment!");
      return;
    }
    if (!newComment.trim()) return;
    try {
      const comment = {
        timestamp: new Date(),
        user: currentUser.name,
        role: currentUser.role,
        content: newComment,
      };
      await addCommentToGame(game.id, comment);
      setGame((prev) => ({
        ...prev,
        comments: [...prev.comments, comment],
      }));
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    } else if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          Game not found.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-20 space-y-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        {game.gameName}
      </h1>
      <p className="text-lg text-gray-600 mb-4">{game.gameDesc}</p>
      <img
        src={game.gamePreview}
        alt={game.gameName}
        className="w-full h-[300px] object-cover rounded-lg shadow-md mb-4"
      />
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
        <div className="text-gray-700">
          <p className="text-base">
            Contributors:{" "}
            <span className="font-bold">
              {game.gameContributors.join(" , ")}
            </span>
          </p>
          <p className="text-base">
            Team: <span className="font-medium">{game.teamName}</span>
          </p>
          <p className="text-base">
            Likes: <span className="font-medium">{game.likes.length}</span>
          </p>
          <p className="text-base">
            Submitted on:{" "}
            <span className="font-medium">
              {formatTimestamp(game.timestamp)}
            </span>
          </p>
        </div>
        <button
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition"
          onClick={handleLike}
        >
          <FaHeart size={24} />
          <span>{game.likes.length}</span>
        </button>
      </div>

      <iframe
        src={`${game.scratchUrl}/embed`}
        title={game.gameName}
        className="w-full h-[300px] md:h-[500px] border-0 rounded-lg shadow-md"
        allowFullScreen
      ></iframe>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Comments {`(${game.comments.length})`}
        </h2>
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Comment
          </button>
        </div>
        <div className="space-y-4">
          {game.comments.map((comment, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow-md border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold flex gap-2 items-center text-gray-900">
                  <MdAccountCircle size={30} />
                  {comment.user}
                  {comment.role && comment.role !== "team" && (
                    <span className="p-1 bg-yellow-200 rounded-md text-xs text-yellow-800">
                      {comment.role.toUpperCase()}
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTimestamp(comment.timestamp)}
                </p>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
