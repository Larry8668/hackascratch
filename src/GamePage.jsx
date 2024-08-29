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
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex justify-center items-center h-screen">
        Game not found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-5 space-y-5 mt-20">
      <h1 className="text-3xl font-bold mb-2">{game.gameName}</h1>
      <p className="text-lg text-gray-700 mb-4">{game.gameDesc}</p>
      <img
        src={game.gamePreview}
        alt={game.gameName}
        className="w-full h-[300px] object-cover rounded-md mb-4"
      />
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-700">
          <p>Contributors: {game.gameContributors.join(", ")}</p>
          <p>Team: {game.teamName}</p>
          <p>Likes: {game.likes.length}</p>
          <p>Submitted on: {formatTimestamp(game.timestamp)}</p>
        </div>
        <button
          className="flex items-center space-x-2 text-red-500"
          onClick={handleLike}
        >
          <FaHeart />
          <span>{game.likes.length}</span>
        </button>
      </div>

      <iframe
        src={`${game.scratchUrl}/embed`}
        title={game.gameName}
        className="w-full h-[500px] border-2 border-gray-300 rounded-md"
        allowFullScreen
      ></iframe>

      <div className="mt-5">
        <h2 className="text-2xl font-semibold mb-3">
          Comments {`(${game.comments.length})`}
        </h2>
        <div className="my-4 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddComment}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Comment
          </button>
        </div>
        <div className="space-y-3 p-4 border-2 border-gray-300 rounded-xl">
          {game.comments.map((comment, index) => (
            <div
              key={index}
              className="p-3 shadow-lg border border-gray-200 rounded-md"
            >
              <div className="w-full flex justify-between items-center">
                <p className="font-semibold flex gap-2 items-center">
                  <MdAccountCircle size={28} />
                  {comment.user}
                  {comment.role && comment.role != "team" && (
                    <div className="p-1 bg-yellow-300 rounded-md text-xs">
                      {comment.role.toUpperCase()}
                    </div>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTimestamp(comment.timestamp)}
                </p>
              </div>
              <p className="px-5 text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
