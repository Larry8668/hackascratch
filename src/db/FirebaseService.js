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
const teamsCollection = collection(db, "teams");
const usersCollection = collection(db, "users");

// Add a new game
export const addGame = async (gameData) => {
  try {
    await addDoc(gamesCollection, {
      ...gameData,
      timestamp: Timestamp.now(),
      likes: [], // Initialize likes as an empty array
      comments: [], // Initialize comments as an empty array
    });
    console.log("Game added successfully");
  } catch (error) {
    console.error("Error adding game: ", error);
  }
};

// Fetch all games
export const fetchGames = async () => {
  try {
    const querySnapshot = await getDocs(gamesCollection);
    const games = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    console.log("Comment added!");
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

// Add a new team
export const addTeam = async (teamData) => {
  try {
    await addDoc(teamsCollection, teamData);
    console.log("Team added successfully");
  } catch (error) {
    console.error("Error adding team: ", error);
  }
};

// Fetch all teams
export const fetchTeams = async () => {
  try {
    const querySnapshot = await getDocs(teamsCollection);
    const teams = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return teams;
  } catch (error) {
    console.error("Error fetching teams: ", error);
  }
};

// Add a new user
export const addUser = async (userData) => {
  try {
    await addDoc(usersCollection, userData);
    console.log("User added successfully");
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

// Fetch all users
export const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
};
