import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [sortedData, setSortedData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch leaderboard data from the backend
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentPose =
          localStorage.getItem("currentPose") || "Vrikshasana";
        const API_BASE_URL =
          process.env.REACT_APP_API_URL || "http://localhost:5000";

        console.log("Fetching leaderboard for pose:", currentPose);
        console.log(
          "API URL:",
          `${API_BASE_URL}/leaderboard?pose=${currentPose}`
        );

        const response = await fetch(
          `${API_BASE_URL}/leaderboard?pose=${currentPose}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        // Handle the case where there are no entries in the leaderboard
        if (data.message) {
          console.log("No data message:", data.message);
          setSortedData([]);
          return;
        }

        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.error("Data is not an array:", data);
          setSortedData([]);
          return;
        }

        // Sort the leaderboard data by time in descending order
        const sorted = data
          .filter((item) => item && item.name && item.time) // Filter out invalid entries
          .sort((a, b) => {
            const timeA =
              typeof a.time === "string" ? parseFloat(a.time) : a.time;
            const timeB =
              typeof b.time === "string" ? parseFloat(b.time) : b.time;
            return timeB - timeA;
          })
          .map((item, index) => ({
            ...item,
            position: index + 1,
            time:
              typeof item.time === "string"
                ? item.time
                : `${item.time} seconds`,
          }));

        console.log("Sorted data:", sorted);
        setSortedData(sorted);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError(error.message);
        setSortedData([]);
      } finally {
        setLoading(false);
        // Trigger visibility after fetching data to allow CSS transition
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
      }
    };

    fetchLeaderboard();
  }, []);

  // Separate effect for handling user data
  useEffect(() => {
    if (loading) return; // Don't process user data while loading

    try {
      // Get user details and best time from localStorage
      const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
      const userBestTime = userDetails.time || userDetails.bestTime;

      if (!userDetails.name || !userBestTime) {
        return; // No user data to process
      }

      console.log("Processing user data:", userDetails);

      // Update local leaderboard with user data
      setSortedData((prevData) => {
        const existingUserIndex = prevData.findIndex(
          (user) => user.name === userDetails.name
        );

        if (existingUserIndex > -1) {
          // Update existing user's best time if new time is better
          const currentTime = parseFloat(prevData[existingUserIndex].time);
          const newTime = parseFloat(userBestTime);

          if (newTime > currentTime) {
            const updatedData = [...prevData];
            updatedData[existingUserIndex].time = `${userBestTime} seconds`;
            return updatedData
              .sort((a, b) => {
                const timeA = parseFloat(a.time);
                const timeB = parseFloat(b.time);
                return timeB - timeA;
              })
              .map((item, index) => ({ ...item, position: index + 1 }));
          }
        } else {
          // Add new user to the leaderboard if they are not already present
          const newUser = {
            position: prevData.length + 1,
            name: userDetails.name,
            time: `${userBestTime} seconds`,
          };
          return [...prevData, newUser]
            .sort((a, b) => {
              const timeA = parseFloat(a.time);
              const timeB = parseFloat(b.time);
              return timeB - timeA;
            })
            .map((item, index) => ({ ...item, position: index + 1 }));
        }

        return prevData;
      });
    } catch (error) {
      console.error("Error processing user data:", error);
    }
  }, [loading]);

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
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            minHeight: 80,
            px: 2,
            position: "relative",
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
              mb: { xs: 1, sm: 0 },
            }}
          >
            Leaderboard
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              position: { xs: "static", sm: "absolute" },
              right: { sm: 24 },
              mt: { xs: 1, sm: 0 },
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
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
          px: { xs: 1, sm: 2, md: 0 },
        }}
      >
        <Box
          sx={{ display: "flex", gap: { xs: 1, md: 2 }, mb: { xs: 2, md: 4 } }}
        >
          {/* Buttons moved to header */}
        </Box>
        <Box
          className="leaderboard"
          sx={{
            width: "100%",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 3,
            p: { xs: 1, md: 3 },
            overflowX: "auto",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#ffeb3b",
              mb: { xs: 1, md: 2 },
              textAlign: "center",
              fontWeight: 700,
              fontSize: { xs: 18, md: 24 },
            }}
          >
            🏆 Longest Times for{" "}
            {localStorage.getItem("currentPose") || "Vrikshasana"}
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#ffeb3b" }} />
            </Box>
          ) : error ? (
            <Box sx={{ color: "white", textAlign: "center", py: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Failed to load leaderboard
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                {error}
              </Typography>
              <Button
                onClick={() => window.location.reload()}
                variant="contained"
                sx={{
                  mt: 2,
                  background:
                    "linear-gradient(135deg, #7289da 0%, #2c3e50 100%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2c3e50 0%, #7289da 100%)",
                  },
                }}
              >
                Retry
              </Button>
            </Box>
          ) : sortedData.length === 0 ? (
            <Box sx={{ color: "white", textAlign: "center", py: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No scores yet!
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                Be the first to complete a pose and set a record!
              </Typography>
            </Box>
          ) : (
            <ul
              className="leaderboard-list"
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              {sortedData.map((user, index) => (
                <li
                  key={index}
                  className={`leaderboard-item ${
                    visible ? "visible" : ""
                  } rank-${user.position}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                    flexDirection: window.innerWidth < 600 ? "column" : "row",
                    gap: window.innerWidth < 600 ? 8 : 0,
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
                      mr: { xs: 0, md: 2 },
                      mb: { xs: 1, md: 0 },
                    }}
                  >
                    {user.position}
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      color: "white",
                      fontWeight: 500,
                      fontSize: { xs: 16, md: 20 },
                      textAlign: window.innerWidth < 600 ? "center" : "left",
                    }}
                  >
                    {user.name}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffeb3b",
                      fontWeight: 700,
                      fontSize: { xs: 16, md: 20 },
                      textAlign: window.innerWidth < 600 ? "center" : "right",
                    }}
                  >
                    {user.time}
                  </Box>
                </li>
              ))}
            </ul>
          )}
        </Box>
      </Container>
    </Box>
  );
}
