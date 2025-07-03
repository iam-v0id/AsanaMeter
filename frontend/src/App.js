import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Yoga from "./pages/Yoga";
import About from "./pages/About";
import Tutorials from "./pages/Tutorials";
import Leaderboard from "./pages/Leaderboard";
import UserInfoForm from "./components/UserInfoForm";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [userData, setUserData] = useState({ name: "", age: "" });
  const [userScore, setUserScore] = useState(null);

  const handleUserDetailsSubmit = (data) => setUserData(data);
  const handleGameCompletion = (score) => setUserScore(score);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/user-info"
          element={<UserInfoForm onSubmit={handleUserDetailsSubmit} />}
        />
        <Route
          path="/start"
          element={
            <Yoga userData={userData} onGameComplete={handleGameCompletion} />
          }
        />
        <Route
          path="/leaderboard"
          element={<Leaderboard userScore={userScore} userData={userData} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/tutorials" element={<Tutorials />} />
      </Routes>
    </Router>
  );
}
