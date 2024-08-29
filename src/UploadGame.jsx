import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { db, storage } from "./db/FirebaseInit";
import { addGame } from "./db/FirebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { FaInfo } from "react-icons/fa6";

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

    if (!gameName || !gameDesc || !scratchUrl || contributors.length === 0) {
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

  const handleInfoClick = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-lg w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col p-4 ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-900">
            How to Publish Your Scratch Project
          </h2>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          To publish your Scratch project and get a shareable link, follow these steps:
        </p>
        <ol className="list-decimal list-inside mt-2 text-sm text-gray-600">
          <li>Open your Scratch project in the Scratch editor.</li>
          <li>Click on the 'File' menu in the top left corner.</li>
          <li>Select 'Save now' to ensure your project is saved.</li>
          <li>Click on the 'Share' button located near the top of the editor.</li>
          <li>Once your project is shared, a link will be generated.</li>
          <li>Use that link to get the project ID and paste it here.</li>
        </ol>
        <p className="mt-2 text-sm text-gray-600">Good Luck!</p>
      </div>
    ), {
      duration: 10000, 
    });
    
    
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-slate-200 rounded-lg shadow-md mt-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">Upload Your Game</h2>
        <div
          className="p-2 border border-slate-400 rounded-md cursor-pointer"
          onClick={handleInfoClick}
        >
          <FaInfo />
        </div>
      </div>

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
