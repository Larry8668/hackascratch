import React, { useState, useEffect, createContext, useContext } from "react";
import { db, auth } from "../db/FirebaseInit";
import {
  query,
  where,
  getDocs,
  getDoc,
  doc,
  collection,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });
  const [accountType, setAccountType] = useState(() => {
    const accountTypeData = localStorage.getItem("accountType");
    return accountTypeData ? JSON.parse(accountTypeData) : "users";
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userQuery = query(
          collection(db, accountType),
          where("uid", "==", user.uid)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setCurrentUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          console.error("No such user document!");
          setCurrentUser(null);
          localStorage.removeItem("user");
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accountType");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password, accountType) => {
    try {
      setLoading(true);
      let searchCollection = "";
      switch (accountType) {
        case "mentor":
          searchCollection = "users";
          break;
        case "team":
          searchCollection = "teams";
          break;
        default:
          throw new Error("Invalid account type");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create a query to find the document with uid matching user.uid
      const userQuery = query(
        collection(db, searchCollection),
        where("uid", "==", user.uid)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data(); // Get the first document's data
        setCurrentUser(userData);
        setAccountType(searchCollection);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accountType", JSON.stringify(searchCollection));
      } else {
        console.error("No such user document!");
        throw new Error("No such user exists!");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setCurrentUser(null);
      setAccountType("users");
      localStorage.removeItem("account");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, accountType, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
