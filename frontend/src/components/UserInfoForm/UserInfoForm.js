import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function UserInfoForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [pose, setPose] = useState("");
  const [time, setTime] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("userId", userId);
    }
    const userDetails = { userId, name, age, pose, time: 0 };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    navigate("/start");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #23272a 0%, #2c3e50 50%, #7289da 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Dialog
        open={true}
        onClose={() => {}}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(44, 62, 80, 0.98)",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Montserrat, Poppins, sans-serif",
              color: "#7289da",
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            Enter Your Info
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              InputProps={{ sx: { color: "white" } }}
              InputLabelProps={{ sx: { color: "#7289da" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#7289da" },
                  "&:hover fieldset": { borderColor: "#2c3e50" },
                  "&.Mui-focused fieldset": { borderColor: "#7289da" },
                  background: "rgba(255,255,255,0.04)",
                },
                input: { color: "white" },
              }}
            />
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              fullWidth
              InputProps={{ sx: { color: "white" } }}
              InputLabelProps={{ sx: { color: "#7289da" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#7289da" },
                  "&:hover fieldset": { borderColor: "#2c3e50" },
                  "&.Mui-focused fieldset": { borderColor: "#7289da" },
                  background: "rgba(255,255,255,0.04)",
                },
                input: { color: "white" },
              }}
            />
            <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #7289da 0%, #2c3e50 100%)",
                  color: "white",
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: 18,
                  fontWeight: 700,
                  boxShadow: "0px 0px 15px rgba(114, 137, 218, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2c3e50 0%, #7289da 100%)",
                    boxShadow: "0px 0px 25px rgba(114, 137, 218, 0.5)",
                  },
                }}
                fullWidth
              >
                Start Game
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
