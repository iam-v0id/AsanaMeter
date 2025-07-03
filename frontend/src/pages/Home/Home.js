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
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            minHeight: 96,
            px: 3,
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
              flex: 1,
              mb: { xs: 1, sm: 0 },
            }}
          >
            Yoga Challenge
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
            <Link to="/about" style={{ textDecoration: "none" }}>
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
          </Box>
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
          px: { xs: 1, sm: 2, md: 0 },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "#ffeb3b",
            fontFamily: "Raleway, sans-serif",
            mt: { xs: 2, md: 4 },
            mb: { xs: 1, md: 2 },
            textShadow: "2px 2px 8px #000",
            fontSize: { xs: 32, sm: 40, md: 56 },
            textAlign: "center",
          }}
        >
          Asana Meter
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, md: 4 },
            mt: { xs: 2, md: 4 },
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link to="/user-info" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              sx={{
                borderRadius: 8,
                fontSize: { xs: 18, md: 22 },
                px: { xs: 2, md: 4 },
                py: { xs: 1, md: 2 },
                background: "linear-gradient(135deg, #7289da 0%, #2c3e50 100%)",
                color: "white",
                boxShadow: "0px 0px 15px rgba(114, 137, 218, 0.3)",
                minWidth: 180,
                minHeight: 48,
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
                fontSize: { xs: 18, md: 22 },
                px: { xs: 2, md: 4 },
                py: { xs: 1, md: 2 },
                color: "#7289da",
                borderColor: "#7289da",
                background: "rgba(255,255,255,0.05)",
                minWidth: 180,
                minHeight: 48,
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
