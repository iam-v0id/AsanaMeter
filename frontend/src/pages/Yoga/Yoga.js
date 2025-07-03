import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { count } from "../../utils/music";
import Instructions from "../../components/Instructions/Instructions";
import DropDown from "../../components/DropDown/DropDown";
import { poseImages } from "../../utils/pose_images";
import { POINTS, keypointConnections } from "../../utils/data";
import { drawPoint, drawSegment } from "../../utils/helper";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import "./Yoga.css";

const CLASS_NO = {
  Utkatasana: 0,
  Bhujangasana: 1,
  Parvatasana: 2,
  No_Pose: 3,
  Sarvangasana: 4,
  Triangle: 5,
  Vrikshasana: 6,
  Virbhadrasana: 7,
};

const poseList = [
  "Vrikshasana",
  "Utkatasana",
  "Bhujangasana",
  "Virbhadrasana",
  "Parvatasana",
  "Sarvangasana",
  "Trikonasana",
];

let skeletonColor = "rgb(255,255,255)";

function Yoga() {
  // Responsive window size
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mutable refs for interval and flag
  const intervalRef = useRef(null);
  const flagRef = useRef(false);
  const countAudio = useRef(new Audio(count));

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #23272a 0%, #2c3e50 50%, #7289da 100%) !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
    const audio = countAudio.current;
    return () => {
      document.head.removeChild(style);
      if (intervalRef.current) clearInterval(intervalRef.current);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState(
    localStorage.getItem("currentPose") || "Vrikshasana"
  );
  const [isStartPose, setIsStartPose] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    setPoseTime(timeDiff);
    if (timeDiff > bestPerform) {
      setBestPerform(timeDiff);
      let userDetails;
      try {
        userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
      } catch {
        userDetails = {};
      }
      userDetails.pose = currentPose;
      userDetails.time = timeDiff;
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    }
  }, [currentTime, bestPerform, currentPose, startingTime]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
    localStorage.setItem("currentPose", currentPose);
  }, [currentPose]);

  const normalizePoseLandmarks = (landmarks) => {
    const poseCenter = getCenterPoint(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    landmarks = tf.sub(landmarks, tf.expandDims(poseCenter, 1));
    const poseSize = getPoseSize(landmarks);
    return tf.div(landmarks, poseSize);
  };

  const landmarksToEmbedding = (landmarks) => {
    return tf.reshape(
      normalizePoseLandmarks(tf.expandDims(landmarks, 0)),
      [1, 34]
    );
  };

  const detectPose = async (detector, poseClassifier) => {
    if (webcamRef.current?.video.readyState === 4) {
      const video = webcamRef.current.video;
      const pose = await detector.estimatePoses(video);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      try {
        if (!pose[0] || !pose[0].keypoints) {
          // No pose detected, skip processing
          return;
        }
        const keypoints = pose[0].keypoints;
        const input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4) {
            drawPoint(ctx, keypoint.x, keypoint.y, 8, "rgb(255,255,255)");
            const connections = keypointConnections[keypoint.name];
            connections?.forEach((connection) => {
              const conName = connection.toUpperCase();
              drawSegment(
                ctx,
                [keypoint.x, keypoint.y],
                [keypoints[POINTS[conName]].x, keypoints[POINTS[conName]].y],
                skeletonColor
              );
            });
          }
          return [keypoint.x, keypoint.y];
        });

        const processedInput = landmarksToEmbedding(input);
        const classification = poseClassifier.predict(processedInput);
        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose];
          if (data[0][classNo] > 0.97) {
            handlePoseDetected();
          } else {
            handlePoseNotDetected();
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const runMovenet = useCallback(async () => {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    const poseClassifier = await tf.loadLayersModel(
      "https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
    );

    countAudio.current.loop = false;
    intervalRef.current = setInterval(() => {
      detectPose(detector, poseClassifier);
    }, 100);
  }, [startingTime, detectPose]);

  const handlePoseDetected = () => {
    if (!flagRef.current) {
      flagRef.current = true;
      countAudio.current.play();
      setStartingTime(Date.now());
    }
    setCurrentTime(Date.now());
    skeletonColor = "rgb(0,255,0)";
  };

  const handlePoseNotDetected = () => {
    flagRef.current = false;
    skeletonColor = "rgb(255,255,255)";
    countAudio.current.pause();
    countAudio.current.currentTime = 0;
  };

  const startPose = () => {
    setIsStartPose(true);
    runMovenet();
  };

  const stopPose = async () => {
    setIsStartPose(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    try {
      let userDetails;
      try {
        userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
      } catch {
        userDetails = {};
      }
      userDetails.pose = currentPose;
      userDetails.time = poseTime;
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/add-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        setApiError("Failed to save user information. Please try again.");
      } else {
        setApiError("");
      }
    } catch (error) {
      setApiError("Error saving user information. Please try again.");
      console.error("Error:", error);
    }
  };

  if (isStartPose) {
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
                flex: 1,
              }}
            >
              Asana Meter
            </Typography>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            px: { xs: 1, sm: 2, md: 0 },
            mt: { xs: 1, md: 4 },
            minHeight: 0,
          }}
        >
          <Grid
            container
            spacing={{ xs: 1, md: 2 }}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: { xs: 1, md: 3 } }}
          >
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 2,
                  px: { xs: 1, md: 3 },
                  py: { xs: 0.5, md: 1 },
                  textAlign: "center",
                  fontSize: { xs: 16, md: 20 },
                }}
              >
                Pose Time: {poseTime.toFixed(2)} s
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  color: "#ffeb3b",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 2,
                  px: { xs: 1, md: 3 },
                  py: { xs: 0.5, md: 1 },
                  textAlign: "center",
                  fontSize: { xs: 16, md: 20 },
                }}
              >
                Best: {bestPerform.toFixed(2)} s
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                mt: { xs: 1, md: 0 },
              }}
            >
              <Button
                onClick={stopPose}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #ff1744 0%, #b71c1c 100%)",
                  color: "white",
                  borderRadius: 2,
                  px: { xs: 2, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  fontSize: { xs: 14, md: 18 },
                  fontWeight: 700,
                  boxShadow: "0px 0px 15px rgba(255, 23, 68, 0.2)",
                  minWidth: 120,
                  minHeight: 44,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #b71c1c 0%, #ff1744 100%)",
                    boxShadow: "0px 0px 25px rgba(255, 23, 68, 0.3)",
                  },
                }}
              >
                Stop Pose
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={{ xs: 1, md: 4 }}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: { xs: 1, md: 3 } }}
          >
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 2, md: 0 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: { xs: 200, sm: 250, md: 300 },
                }}
              >
                <img
                  src={poseImages[currentPose]}
                  alt={currentPose}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "100%",
                    borderRadius: 8,
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.15)",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { xs: "100vw", sm: 480, md: 900 },
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Webcam
                  width={
                    windowWidth > 900
                      ? 900
                      : windowWidth < 600
                      ? Math.min(windowWidth - 32, 400)
                      : 480
                  }
                  height={
                    windowWidth > 900
                      ? 600
                      : windowWidth < 600
                      ? Math.min((windowWidth - 32) * 0.75, 300)
                      : 320
                  }
                  ref={webcamRef}
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 32px 0 rgba(0,0,0,0.25)",
                    width: "100%",
                    maxWidth:
                      windowWidth < 600 ? Math.min(windowWidth - 32, 400) : 900,
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
                <canvas
                  ref={canvasRef}
                  width={
                    windowWidth > 900
                      ? 900
                      : windowWidth < 600
                      ? Math.min(windowWidth - 32, 400)
                      : 480
                  }
                  height={
                    windowWidth > 900
                      ? 600
                      : windowWidth < 600
                      ? Math.min((windowWidth - 32) * 0.75, 300)
                      : 320
                  }
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 1,
                    borderRadius: 16,
                    width: "100%",
                    maxWidth:
                      windowWidth < 600 ? Math.min(windowWidth - 32, 400) : 900,
                    height: "auto",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {/* Stop Pose button moved to timer row */}
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100vh",
        background:
          "linear-gradient(135deg, #23272a 0%, #2c3e50 50%, #7289da 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
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
            minHeight: { xs: 56, sm: 80 },
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
            Asana Meter
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
              onClick={() => navigate("/leaderboard")}
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
              Leaderboard
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
        maxWidth={false}
        disableGutters
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          px: 0,
          mt: 4,
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 3, width: "100%" }}
        >
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <DropDown
              poseList={poseList}
              currentPose={currentPose}
              setCurrentPose={setCurrentPose}
            />
            <Button
              onClick={startPose}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                color: "white",
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: 18,
                fontWeight: 700,
                boxShadow: "0px 0px 18px 2px rgba(67, 233, 123, 0.25)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)",
                  boxShadow: "0px 0px 28px 4px rgba(67, 233, 123, 0.35)",
                },
              }}
            >
              Start Pose
            </Button>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Instructions currentPose={currentPose} />
        </Box>
        {apiError && (
          <Box sx={{ color: "red", textAlign: "center", mb: 2 }}>
            {apiError}
          </Box>
        )}
      </Container>
    </Box>
  );
}

const getCenterPoint = (landmarks, leftBodypart, rightBodypart) => {
  const left = tf.gather(landmarks, leftBodypart, 1);
  const right = tf.gather(landmarks, rightBodypart, 1);
  return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
};

const getPoseSize = (landmarks, torsoSizeMultiplier = 2.5) => {
  const hipsCenter = getCenterPoint(
    landmarks,
    POINTS.LEFT_HIP,
    POINTS.RIGHT_HIP
  );
  const shouldersCenter = getCenterPoint(
    landmarks,
    POINTS.LEFT_SHOULDER,
    POINTS.RIGHT_SHOULDER
  );
  const torsoSize = tf.norm(tf.sub(shouldersCenter, hipsCenter));
  const poseCenterNew = tf.expandDims(
    getCenterPoint(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP),
    1
  );
  const d = tf.gather(tf.sub(landmarks, poseCenterNew), 0, 0);
  const maxDist = tf.max(tf.norm(d, "euclidean", 0));
  return tf.maximum(tf.mul(torsoSize, torsoSizeMultiplier), maxDist);
};

export default Yoga;
