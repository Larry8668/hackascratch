import React, { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../db/FirebaseInit";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const MembersScreen = ({ members, setMembers, logout, role }) => {
  if (!role || role === "team") return;
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showMemberPassword, setShowMemberPassword] = useState(false);

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
        voted: true,
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

  return (
    <div className="space-y-8">
      {role && role === "admin" && (
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
            <div className="w-full flex gap-2">
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
      )}
      <div>
        <h2 className="text-xl font-semibold my-4">Members List</h2>
        <ul className="bg-white rounded-md shadow-md p-4">
          {members.map((member) => (
            <li key={member.uid} className="py-2 border-b last:border-b-0">
              {member.name} - {member.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MembersScreen;
