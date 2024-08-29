import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import App from "./App.jsx";
import Guide from "./Guide.jsx";
import Explore from "./Explore.jsx";
import GamePage from "./GamePage.jsx";
import UploadGame from "./UploadGame.jsx";
import Login from "./Login.jsx";
import Voting from "./Voting.jsx";
import Results from "./Results.jsx";
import Dashboard from "./Dashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:gameId" element={<GamePage />} />
          <Route path="/upload" element={<UploadGame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" reverseOrder={false} />
    </AuthProvider>
  </StrictMode>
);
