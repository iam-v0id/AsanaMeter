import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "./Home.css";

export default function Home() {
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);

  useEffect(() => {
    // Only show disclaimer if not already shown in this browser
    const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
    if (!hasSeenDisclaimer) {
      setDisclaimerVisible(true);
      localStorage.setItem("hasSeenDisclaimer", "true");
    }
  }, []);

  const closeDisclaimer = () => {
    setDisclaimerVisible(false);
  };

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
      {/* Disclaimer Dialog */}
      <Dialog open={disclaimerVisible} onClose={closeDisclaimer}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Important Notice</span>
          <IconButton onClick={closeDisclaimer} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This application is designed purely for entertainment and should not
            be used as a guide or instructional tool for practicing yogasanas.
            Yoga is a sensitive and profound discipline that should only be
            learned under the supervision of qualified instructors. Please enjoy
            this game responsibly and treat it as a fun experience only.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDisclaimer} variant="contained" color="primary">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 96,
            px: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Montserrat, Poppins, sans-serif",
              color: "white",
              letterSpacing: 1,
              textAlign: "center",
              flex: 1,
            }}
          >
            Yoga Challenge
          </Typography>
          <Link
            to="/about"
            style={{ textDecoration: "none", position: "absolute", right: 24 }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<InfoIcon />}
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  background: "white",
                  color: "#7289da",
                  borderColor: "white",
                },
              }}
            >
              About
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
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
        <Typography
          variant="h2"
          sx={{
            color: "#ffeb3b",
            fontFamily: "Raleway, sans-serif",
            mt: 4,
            mb: 2,
            textShadow: "2px 2px 8px #000",
          }}
        >
          Asana Meter
        </Typography>
        <Box sx={{ display: "flex", gap: 4, mt: 4 }}>
          <Link to="/user-info" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              sx={{
                borderRadius: 8,
                fontSize: 22,
                px: 4,
                py: 2,
                background: "linear-gradient(135deg, #7289da 0%, #2c3e50 100%)",
                color: "white",
                boxShadow: "0px 0px 15px rgba(114, 137, 218, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2c3e50 0%, #7289da 100%)",
                  boxShadow: "0px 0px 25px rgba(114, 137, 218, 0.5)",
                },
              }}
            >
              Let's Begin
            </Button>
          </Link>
          <Link to="/tutorials" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<SchoolIcon />}
              sx={{
                borderRadius: 8,
                fontSize: 22,
                px: 4,
                py: 2,
                color: "#7289da",
                borderColor: "#7289da",
                background: "rgba(255,255,255,0.05)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7289da 0%, #2c3e50 100%)",
                  color: "white",
                  borderColor: "#7289da",
                },
              }}
            >
              Tutorials
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
