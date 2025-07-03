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
        gap: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          flex: 2,
          p: 3,
          borderRadius: 3,
          background: "rgba(44, 62, 80, 0.95)",
          mb: { xs: 2, md: 0 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#ffeb3b", mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          How to do {currentPose}
        </Typography>
        <Box component="ul" sx={{ pl: 3, m: 0, textAlign: "left" }}>
          {poseInstructions[currentPose].map((instruction, idx) => (
            <Typography
              component="li"
              key={idx}
              sx={{ color: "white", mb: 1.5, fontSize: 18, lineHeight: 1.6 }}
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
          minWidth: 180,
          height: "100%",
        }}
      >
        <img
          className="pose-demo-img"
          src={poseImages[currentPose]}
          alt={`Demonstration of ${currentPose}`}
          style={{
            maxWidth: 420,
            width: "100%",
            borderRadius: 8,
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.15)",
          }}
        />
      </Box>
    </Box>
  );
}
