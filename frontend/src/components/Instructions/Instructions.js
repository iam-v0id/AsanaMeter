import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { poseInstructions } from "../../utils/data";
import { poseImages } from "../../utils/pose_images";

export default function Instructions({ currentPose }) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        mb: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 2, md: 4 },
        px: { xs: 2, md: 0 },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          flex: 2,
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          background: "rgba(44, 62, 80, 0.95)",
          mb: { xs: 2, md: 0 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#ffeb3b",
            mb: 2,
            textAlign: "center",
            fontWeight: 700,
            fontSize: { xs: 18, md: 20 },
          }}
        >
          How to do {currentPose}
        </Typography>
        <Box
          component="ul"
          sx={{ pl: 3, m: 0, textAlign: "left", width: "100%" }}
        >
          {poseInstructions[currentPose].map((instruction, idx) => (
            <Typography
              component="li"
              key={idx}
              sx={{
                color: "white",
                mb: 1.5,
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.6,
              }}
            >
              {instruction}
            </Typography>
          ))}
        </Box>
      </Paper>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: { xs: 300, sm: 400, md: 420 },
        }}
      >
        <img
          src={poseImages[currentPose]}
          alt={`Demonstration of ${currentPose}`}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "400px",
            borderRadius: 8,
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.15)",
            objectFit: "contain",
          }}
        />
      </Box>
    </Box>
  );
}
