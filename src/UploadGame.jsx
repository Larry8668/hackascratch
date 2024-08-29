import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { db, storage } from "./db/FirebaseInit";
import { addGame } from "./db/FirebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const UploadGame = () => {
  const { currentUser } = useAuth();
  const [gameName, setGameName] = useState("");
  const [gameDesc, setGameDesc] = useState("");
  const [gameImage, setGameImage] = useState(null);
  const [scratchUrl, setScratchUrl] = useState("");
  const [teamName, setTeamName] = useState(currentUser ? currentUser.name : "");
  const [contributors, setContributors] = useState(
    currentUser && currentUser.members ? currentUser.members : []
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setGameImage(e.target.files[0]);
    }
  };

  const handleContributorChange = (e, index) => {
    const newContributors = [...contributors];
    newContributors[index] = e.target.value;
    setContributors(newContributors);
  };

  const handleAddContributor = () => {
    if (contributors.length == 2) {
      toast.error("Only 2 contributors are allowed");
      return;
    }
    setContributors([...contributors, ""]);
  };

  const handleRemoveContributor = (index) => {
    const newContributors = contributors.filter((_, i) => i !== index);
    setContributors(newContributors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !gameName ||
      !gameDesc ||
      !scratchUrl ||
      contributors.length === 0
    ) {
      toast.error(
        "All fields are required, and at least one contributor is needed."
      );
      setError(
        "All fields are required, and at least one contributor is needed."
      );
      return;
    }

    setUploading(true);

    try {
      let imageUrl =
        "https://firebasestorage.googleapis.com/v0/b/hackascratch.appspot.com/o/game_preview_images%2Fdefault-img.png?alt=media&token=ab240d7c-f2c1-434e-8936-9d70ad259dfe";
      if (gameImage) {
        // Generate a unique file name
        const imageRef = ref(
          storage,
          `game_preview_images/${uuidv4()}-${gameImage.name}`
        );

        // Upload the image to Firebase Storage
        await uploadBytes(imageRef, gameImage);

        // Get the image URL
        imageUrl = await getDownloadURL(imageRef);
      }

      // Prepare the game data
      const gameData = {
        gameName,
        gameDesc,
        gamePreview: imageUrl,
        scratchUrl: "https://scratch.mit.edu/projects/" + scratchUrl,
        teamName,
        gameContributors: contributors.filter(
          (contributor) => contributor.trim() !== ""
        ), // Remove empty names
        likes: [],
        comments: [],
        timestamp: new Date(),
      };

      // Add the game to Firestore
      await addGame(gameData);

      setSuccess("Game uploaded successfully!");
      setGameName("");
      setGameDesc("");
      setGameImage(null);
      setScratchUrl("");
      setContributors([]);
    } catch (error) {
      console.error("Error uploading game:", error);
      setError("Failed to upload game. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    window.location.href = "/login";
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-slate-200 rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Game</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Game Name
          </label>
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter game name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Game Description
          </label>
          <textarea
            value={gameDesc}
            onChange={(e) => setGameDesc(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter game description"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Game Preview Image
          </label>
          <small className="text-gray-500">Optional</small>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            accept="image/*"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Scratch Project ID
          </label>
          <small className="text-gray-500">
            Example: Enter{" "}
            <span className="underline text-black">123456789</span> from
            https://scratch.mit.edu/projects/
            <span className="underline text-black">123456789</span>/
          </small>
          <input
            type="text"
            value={scratchUrl}
            onChange={(e) => setScratchUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter Scratch project ID"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Team Name
          </label>
          <input
            type="text"
            disabled
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter team name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Game Contributors
          </label>
          {contributors?.map((contributor, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={contributor}
                onChange={(e) => handleContributorChange(e, index)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter contributor name"
                required={index === 0} // First contributor is required
              />
              <button
                type="button"
                onClick={() => handleRemoveContributor(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddContributor}
            className="text-blue-500"
          >
            Add Contributor
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`p-3 bg-blue-500 text-white rounded-md ${
              uploading ? "opacity-50" : ""
            }`}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Game"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadGame;
