export const poseInstructions = {
  Vrikshasana: [
    "Stand tall with both feet grounded and weight balanced.",
    "Shift weight to one leg. Place the sole of your other foot on your inner thigh (avoid the knee), with your knee pointing outward.",
    "Bring your hands together in front of your chest (prayer position). Stand tall and lengthen your spine.",
    "Hold the pose, breathing steadily. Switch sides when ready.",
  ],
  Bhujangasana: [
    "Lie face down, legs extended, hands under shoulders.",
    "Inhale and gently lift your chest, keeping your pelvis on the floor. Press your tailbone down and engage your legs.",
    "Draw your shoulders back and lift through your chest, keeping your elbows close to your body.",
    "Hold for 15–30 seconds, breathing easily. Exhale and lower down.",
  ],
  Parvatasana: [
    "Start on hands and knees, hands slightly ahead of shoulders, knees under hips.",
    "Exhale, lift your knees, and raise your hips, forming an inverted ‘V.’ Keep your spine long and heels reaching toward the floor.",
    "Press your hands firmly into the mat, arms straight, and head between your arms.",
    "Hold for several breaths, then gently lower your knees to rest.",
  ],
  Utkatasana: [
    "Stand with feet hip-width apart, arms at your sides.",
    "Inhale, raise your arms overhead, keeping them straight and parallel.",
    "Exhale, bend your knees and lower your hips as if sitting in a chair. Keep your chest lifted and weight in your heels.",
    "Hold, breathing steadily, then return to standing.",
  ],
  Virbhadrasana: [
    "Start in a lunge, front knee bent, back leg straight, arms overhead.",
    "Bring hands to your heart, lean forward, and lift your back leg until your body forms a ‘T’ shape.",
    "Keep your standing leg strong and arms reaching forward.",
    "Hold, then gently return to standing and switch sides.",
  ],
  Trikonasana: [
    "Stand with feet wide apart, turn one foot out. Extend arms to the sides at shoulder height.",
    "Reach forward over your front leg, then lower your hand to your shin or the floor, and extend your other arm upward.",
    "Keep your chest open and gaze upward. Hold, then switch sides.",
  ],
  Sarvangasana: [
    "Lie on your back with shoulders on a folded blanket, arms at your sides.",
    "Bend knees, lift hips, and support your lower back with your hands.",
    "Extend your legs upward, keeping your body in a straight line. Gaze upward, keeping your neck neutral.",
    "Hold for several breaths, then gently lower your legs.",
  ],
};

export const tutorials = [
  "1. When prompted, allow camera access so the app can detect your pose.",
  "2. Choose your desired yoga pose from the dropdown menu.",
  "3. Read the instructions for your selected pose to understand how to perform it.",
  "4. Click ‘Start Pose’ and use the reference image to match your posture in front of the camera.",
  "5. If you perform the pose correctly, the skeleton overlay will turn green and a sound will play.",
];

export const fixCamera = [
  "1. Ensure you have granted camera permission to the app. If denied, update your browser settings to allow access.",
  "2. Close any other applications that might be using the camera.",
  "3. Try closing other open browser windows or tabs that may be accessing the camera.",
];

export const POINTS = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,
  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,
  LEFT_HIP: 11,
  RIGHT_HIP: 12,
  LEFT_KNEE: 13,
  RIGHT_KNEE: 14,
  LEFT_ANKLE: 15,
  RIGHT_ANKLE: 16,
};

export const keypointConnections = {
  nose: ["left_ear", "right_ear"],
  left_ear: ["left_shoulder"],
  right_ear: ["right_shoulder"],
  left_shoulder: ["right_shoulder", "left_elbow", "left_hip"],
  right_shoulder: ["right_elbow", "right_hip"],
  left_elbow: ["left_wrist"],
  right_elbow: ["right_wrist"],
  left_hip: ["left_knee", "right_hip"],
  right_hip: ["right_knee"],
  left_knee: ["left_ankle"],
  right_knee: ["right_ankle"],
};
