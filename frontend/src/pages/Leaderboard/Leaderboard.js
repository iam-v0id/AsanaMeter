import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [sortedData, setSortedData] = useState([]);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch leaderboard data from the backend
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/leaderboard?pose=${localStorage.getItem(
            "currentPose"
          )}`
        );
        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const data = await response.json();

        // Handle the case where there are no entries in the leaderboard
        if (data.message) {
          console.log(data.message);
          return;
        }

        // Sort the leaderboard data by time in descending order
        const sorted = data.sort((a, b) => b.time - a.time);
        setSortedData(sorted);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        // Trigger visibility after fetching data to allow CSS transition
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
      }
    };

    fetchLeaderboard();

    // Get user details and best time from localStorage
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
    const userBestTime = userDetails.bestTime || Infinity;

    // Update local leaderboard with user data
    if (userDetails.name) {
      const existingUserIndex = sortedData.findIndex(
        (user) => user.name === userDetails.name
      );

      if (existingUserIndex > -1) {
        // Update existing user's best time if new time is better
        if (userBestTime > sortedData[existingUserIndex].time) {
          sortedData[existingUserIndex].time = userBestTime;
        }
      } else {
        // Add new user to the leaderboard if they are not already present
        sortedData.push({
          position: sortedData.length + 1,
          name: userDetails.name,
          time: `${userBestTime} seconds`,
        });
      }
    }

    setSortedData([...sortedData]);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #23272a 0%, #2c3e50 50%, #7289da 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar
        position="static"
        sx={{
          background:
            "linear-gradient(90deg, #23272a 0%, #2c3e50 50%, #7289da 100%)",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <Toolbar
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 80,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Montserrat, Poppins, sans-serif",
              color: "white",
              letterSpacing: 1,
              textAlign: "center",
              width: "100%",
            }}
          >
            Leaderboard
          </Typography>
          <Box
            sx={{ position: "absolute", right: 24, display: "flex", gap: 2 }}
          >
            <Button
              onClick={() => navigate("/start")}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #7289da 0%, #2c3e50 100%)",
                color: "white",
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2c3e50 0%, #7289da 100%)",
                  color: "white",
                },
              }}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #ff1744 0%, #b71c1c 100%)",
                color: "white",
                fontWeight: 700,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #b71c1c 0%, #ff1744 100%)",
                },
              }}
            >
              Exit
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          {/* Buttons moved to header */}
        </Box>
        <Box
          className="leaderboard"
          sx={{
            width: "100%",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#ffeb3b",
              mb: 2,
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            🏆 Longest Times for {localStorage.getItem("currentPose")}
          </Typography>
          <ul
            className="leaderboard-list"
            style={{ listStyle: "none", padding: 0 }}
          >
            {sortedData.map((user, index) => (
              <li
                key={index}
                className={`leaderboard-item ${visible ? "visible" : ""} rank-${
                  index + 1
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#7289da",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    mr: 2,
                  }}
                >
                  {user.position}
                </Box>
                <Box sx={{ flex: 1, color: "white", fontWeight: 500 }}>
                  {user.name}
                </Box>
                <Box sx={{ color: "#ffeb3b", fontWeight: 700 }}>
                  {user.time}
                </Box>
              </li>
            ))}
          </ul>
        </Box>
      </Container>
    </Box>
  );
}
