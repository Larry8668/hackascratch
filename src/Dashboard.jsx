import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { db, auth } from "./db/FirebaseInit";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Dashboard = () => {
  const { currentUser, accountType, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("members");
  const [members, setMembers] = useState([]);
  const [showMemberPassword, setShowMemberPassword] = useState(false);
  const [showTeamPassword, setShowTeamPassword] = useState(false);
  const [teams, setTeams] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    teamEmail: "",
    password: "",
    members: ["", ""],
  });

  useEffect(() => {
    const fetchMembers = async () => {
      const membersCollection = collection(db, "users");
      const membersSnapshot = await getDocs(membersCollection);
      const membersList = membersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(membersList);
    };

    const fetchTeams = async () => {
      const teamsCollection = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollection);
      const teamsList = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsList);
    };

    fetchMembers();
    fetchTeams();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newMember.email,
        newMember.password
      );
      const user = userCredential.user;

      await addDoc(collection(db, "users"), {
        name: newMember.name,
        email: newMember.email,
        role: "mentor",
        uid: user.uid,
      });

      toast.success("Member added successfully!");
      await logout();

      setNewMember({ name: "", email: "", password: "" });

      // Fetch updated members
      const membersCollection = collection(db, "users");
      const membersSnapshot = await getDocs(membersCollection);
      const membersList = membersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(membersList);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newTeam.teamEmail,
        newTeam.password
      );
      const user = userCredential.user;

      await addDoc(collection(db, "teams"), {
        name: newTeam.teamName,
        email: newTeam.teamEmail,
        members: newTeam.members.filter((member) => member !== ""),
        role: "team",
        uid: user.uid,
      });

      toast.success("Team added successfully!");
      await logout();

      setNewTeam({
        teamName: "",
        teamEmail: "",
        password: "",
        members: ["", ""],
      });

      // Fetch updated teams
      const teamsCollection = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollection);
      const teamsList = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsList);
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!currentUser) {
    window.location.href = "/login";
    return null;
  }

  if (currentUser.role === "admin") {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-[40%] md:w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 pt-12">Dashboard</h1>
            <nav className="space-y-2">
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
              <button onClick={logout} className="px-4 py-2 mt-8 text-red-500">
                Log out
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 pt-12">
            Welcome, {currentUser.name}
          </h1>

          {activeTab === "members" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Members List</h2>
                <ul className="bg-white rounded-md shadow-md p-4">
                  {members.map((member) => (
                    <li
                      key={member.uid}
                      className="py-2 border-b last:border-b-0"
                    >
                      {member.name} - {member.email}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Add Member</h2>
                <form
                  onSubmit={handleAddMember}
                  className="bg-white p-6 rounded-md shadow-md space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <div className="w-full flex">
                    <input
                      type={showMemberPassword ? "text" : "password"}
                      placeholder="Password"
                      value={newMember.password}
                      onChange={(e) =>
                        setNewMember({ ...newMember, password: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    <div
                      className="flex justify-center items-center p-2 border-2 border-slate-200 cursor-pointer rounded-md"
                      onClick={() => setShowMemberPassword((curr) => !curr)}
                    >
                      {showMemberPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md"
                  >
                    Add Member
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "teams" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Teams List</h2>
                <ul className="bg-white rounded-md shadow-md p-4">
                  {teams.map((team) => (
                    <li
                      key={team.uid}
                      className="py-2 border-b last:border-b-0"
                    >
                      {team.name} - {team.email}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Add Team</h2>
                <form
                  onSubmit={handleAddTeam}
                  className="bg-white p-6 rounded-md shadow-md space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Team Name"
                    value={newTeam.teamName}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, teamName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <input
                    type="email"
                    placeholder="Team Email"
                    value={newTeam.teamEmail}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, teamEmail: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <div className="w-full flex">
                    <input
                      type={showTeamPassword ? "text" : "password"}
                      placeholder="Password"
                      value={newTeam.password}
                      onChange={(e) =>
                        setNewTeam({ ...newTeam, password: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    <div
                      className="flex justify-center items-center p-2 border-2 border-slate-200 cursor-pointer rounded-md"
                      onClick={() => setShowTeamPassword((curr) => !curr)}
                    >
                      {showTeamPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Member 1 Name"
                      value={newTeam.members[0]}
                      onChange={(e) => {
                        const members = [...newTeam.members];
                        members[0] = e.target.value;
                        setNewTeam({ ...newTeam, members });
                      }}
                      className="w-full px-4 py-2 border rounded-md mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Member 2 Name"
                      value={newTeam.members[1]}
                      onChange={(e) => {
                        const members = [...newTeam.members];
                        members[1] = e.target.value;
                        setNewTeam({ ...newTeam, members });
                      }}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md"
                  >
                    Add Team
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (currentUser.role === "team") {
    // Find the team document based on the current user's uid
    const team = teams.find((t) => t.uid === currentUser.uid);

    return (
      <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-[40%] md:w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 pt-12">Team Dashboard</h1>
            <nav className="space-y-2">
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
              <button onClick={logout} className="px-4 py-2 mt-8 text-red-500">
                Log out
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 pt-12">
            Welcome, {currentUser.name}
          </h1>

          {activeTab === "members" && team && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Team Members</h2>
              <ul className="bg-white rounded-md shadow-md p-4">
                {currentUser.members.map((member) => (
                  <li className="py-2 border-b last:border-b-0">{member}</li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (currentUser.role === "mentor") {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-[40%] md:w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 pt-12">Mentor Dashboard</h1>
            <nav className="space-y-2">
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
              <button onClick={logout} className="px-4 py-2 mt-8 text-red-500">
                Log out
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 pt-12">
            Welcome, {currentUser.name}
          </h1>

          {activeTab === "members" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Mentors List</h2>
              <ul className="bg-white rounded-md shadow-md p-4">
                {members.map((member) => (
                  <li
                    key={member.uid}
                    className="py-2 border-b last:border-b-0"
                  >
                    {member.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    );
  }

  return null;
};

export default Dashboard;
