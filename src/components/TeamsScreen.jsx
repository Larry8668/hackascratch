import React, { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../db/FirebaseInit";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const TeamsScreen = ({ teams, setTeams, logout, role }) => {
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    teamEmail: "",
    password: "",
    members: ["", ""],
  });
  const [showTeamPassword, setShowTeamPassword] = useState(false);

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
        voted: false,
      });

      toast.success("Team added successfully!");
      await logout();
      setNewTeam({
        teamName: "",
        teamEmail: "",
        password: "",
        members: ["", ""],
      });

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

  return (
    <div className="space-y-8">
      <div>
        {role && role === "admin" && (
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
              <div className="w-full flex gap-2">
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
        )}
        <h2 className="text-xl font-semibold my-4">Teams List</h2>
        <ul className="bg-white rounded-md shadow-md p-4">
          {teams.map((team) => (
            <li key={team.uid} className="py-2 border-b last:border-b-0">
              <div>
                {team.name} - {role !== "team" && team.email}
              </div>
              {team.members && team.members.length > 0 && (
                <ul className="ml-4 mt-2">
                  {team.members.map((member) => (
                    <li key={member.uid} className="py-1">
                      {member}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamsScreen;
