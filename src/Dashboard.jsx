import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./db/FirebaseInit";
import MembersScreen from "./components/MembersScreen";
import TeamsScreen from "./components/TeamsScreen";
import VotingScreen from "./components/VotingScreen";
import { useAuth } from "./context/AuthContext";

const Dashboard = () => {
  const { currentUser, loading, logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState(() => {
    return currentUser?.role === "team" ? "teams" : "members";
  });

  useEffect(() => {
    const fetchData = async () => {
      const membersSnapshot = await getDocs(collection(db, "users"));
      const teamsSnapshot = await getDocs(collection(db, "teams"));

      const membersList = membersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const teamsList = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMembers(membersList);
      setTeams(teamsList);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="h-screen w-screen flex justify-center items-center font-semibold text-xl">
        Loading...
      </div>
    );

  if (!currentUser) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex md:flex-row flex-col">
      <aside className="w-[40%] md:w-64 bg-white shadow-md hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 pt-16">Dashboard</h1>
          <nav className="space-y-2">
            {currentUser?.role != "team" && (
              <button
                onClick={() => setActiveTab("members")}
                className={`w-full text-left px-4 py-2 rounded-md transition ${
                  activeTab === "members"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700"
                }`}
              >
                Members
              </button>
            )}
            <button
              onClick={() => setActiveTab("teams")}
              className={`w-full text-left px-4 py-2 rounded-md transition ${
                activeTab === "teams"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
            >
              Teams
            </button>
            {currentUser?.role != "team" && (
              <button
                onClick={() => setActiveTab("votes")}
                className={`w-full text-left px-4 py-2 rounded-md transition ${
                  activeTab === "votes"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700"
                }`}
              >
                Votes
              </button>
            )}
            <button onClick={logout} className="px-4 py-2 mt-8 text-red-500">
              Log out
            </button>
          </nav>
        </div>
      </aside>

      <div className="max-w-2xl mx-auto mt-20 md:hidden">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="flex space-x-4 mb-4">
          {currentUser?.role != "team" && (
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "members"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("members")}
            >
              Members
            </button>
          )}
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "teams" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("teams")}
          >
            Teams
          </button>
          {currentUser?.role != "team" && (
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "votes" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("votes")}
            >
              Votes
            </button>
          )}
          <button
            className={`px-4 py-2 rounded-md bg-red-500 text-white`}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      <main className="flex-1 px-5 md:p-10">
        <h1 className="text-3xl font-bold mb-6 pt-12">
          Welcome, {currentUser.name}
        </h1>
        {activeTab === "members" && (
          <MembersScreen
            members={members}
            setMembers={setMembers}
            logout={logout}
            role={currentUser?.role}
          />
        )}
        {activeTab === "teams" && (
          <TeamsScreen
            teams={teams}
            setTeams={setTeams}
            logout={logout}
            role={currentUser?.role}
          />
        )}
        {activeTab === "votes" && <VotingScreen role={currentUser?.role} />}
      </main>
    </div>
  );
};

export default Dashboard;
