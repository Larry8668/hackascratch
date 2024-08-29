import toast from "react-hot-toast";
import { db } from "./FirebaseInit";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  query,
  where,
} from "firebase/firestore";

// References to collections
const gamesCollection = collection(db, "games");

// Add a new game
export const addGame = async (gameData) => {
  try {
    await addDoc(gamesCollection, {
      ...gameData,
      timestamp: Timestamp.now(),
      likes: [], // Initialize likes as an empty array
      comments: [], // Initialize comments as an empty array
    });
    toast.success("Game added successfully!");
    console.log("Game added successfully");
  } catch (error) {
    console.error("Error adding game: ", error);
  }
};

// Fetch all games
export const fetchGames = async () => {
  try {
    const querySnapshot = await getDocs(gamesCollection);
    const games = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return games;
  } catch (error) {
    console.error("Error fetching games: ", error);
  }
};

// Update game likes
export const likeGame = async (gameId, user) => {
  try {
    const gameRef = doc(db, "games", gameId);
    await updateDoc(gameRef, {
      likes: arrayUnion(user),
    });
    toast.success("Game liked!");
    console.log("Game liked!");
  } catch (error) {
    console.error("Error liking game: ", error);
  }
};

// Add a comment to a game
export const addCommentToGame = async (gameId, comment) => {
  try {
    const gameRef = doc(db, "games", gameId);
    await updateDoc(gameRef, {
      comments: arrayUnion(comment),
    });
    toast.success("Comment added!");
    console.log("Comment added!");
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};
