import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { poseImages } from "../../utils/pose_images";

export default function DropDown({ poseList, currentPose, setCurrentPose }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelect = (pose) => {
    setCurrentPose(pose);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{
          minWidth: 220,
          background: "linear-gradient(135deg, #7289da 0%, #2c3e50 100%)",
          color: "white",
          fontWeight: 700,
          fontSize: 20,
          borderRadius: 2,
          boxShadow: "0px 0px 10px rgba(114, 137, 218, 0.15)",
          "&:hover": {
            background: "linear-gradient(135deg, #2c3e50 0%, #7289da 100%)",
          },
        }}
      >
        {currentPose}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 260,
            background: "rgba(44, 62, 80, 0.98)",
            color: "white",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
          },
        }}
      >
        {poseList.map((pose) => (
          <MenuItem
            key={pose}
            onClick={() => handleSelect(pose)}
            sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
              <img
                src={poseImages[pose]}
                alt={pose}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  objectFit: "cover",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                }}
              />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{ color: "white", fontWeight: 500, fontSize: 18 }}
            >
              {pose}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
