import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
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
            About
          </Typography>
          <Box sx={{ position: "absolute", right: 24 }}>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #7289da 0%, #2c3e50 100%)",
                color: "white",
                fontWeight: 700,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2c3e50 0%, #7289da 100%)",
                },
              }}
            >
              Back to Home
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
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            background: "rgba(0,0,0,0.35)",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "white", mb: 2, textAlign: "center", fontWeight: 700 }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: 20,
              lineHeight: 1.7,
            }}
          >
            This application leverages advanced AI to analyze your yoga postures
            in real time. First, it detects and maps key points on your body
            from the camera feed, identifying the precise position of each
            joint. Then, using a specialized classification model, it recognizes
            which yoga pose you are performing. When the AI is highly confident
            (over 95% probability) that your pose matches the target, it
            provides instant feedback by highlighting your virtual skeleton in
            green—letting you know you’re doing it right!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
