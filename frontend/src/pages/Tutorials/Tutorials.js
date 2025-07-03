import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { tutorials, fixCamera } from "../../utils/data";

export default function Tutorials() {
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
            Tutorials
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
        <Typography
          variant="h5"
          sx={{ color: "#ffeb3b", mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          Basic Tutorials
        </Typography>
        <Box
          sx={{
            width: "100%",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 3,
            p: 3,
            mb: 4,
          }}
        >
          {tutorials.map((tutorial, idx) => (
            <Typography key={idx} sx={{ color: "white", mb: 1 }}>
              {tutorial}
            </Typography>
          ))}
        </Box>
        <Typography
          variant="h5"
          sx={{ color: "#ffeb3b", mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          Camera Not Working?
        </Typography>
        <Box
          sx={{
            width: "100%",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 3,
            p: 3,
          }}
        >
          {fixCamera.map((points, idx) => (
            <Typography key={idx} sx={{ color: "white", mb: 1 }}>
              {points}
            </Typography>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
