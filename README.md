# Asana Meter (Yoga Pose Timer & Leaderboard)

A browser-based yoga pose coach and timer. It detects poses in real time using TensorFlow MoveNet, times how long the pose is held, and posts scores to a global leaderboard backed by MongoDB. Frontend runs entirely on the client; persistence is via Vercel serverless API.

## Features

- Real-time pose detection with MoveNet (client-side, no video upload)
- Timer and best-time tracking per pose
- Global per-pose leaderboard stored in MongoDB
- Responsive UI with React and MUI
- Works with a standard laptop webcam

## Tech Stack

- Frontend: React (Create React App), TensorFlow.js, MUI
- Pose estimation: MoveNet (SINGLEPOSE_THUNDER)
- Classifier: Small TF.js dense model over normalized keypoints
- Backend: Vercel Serverless Functions (Node.js)
- Database: MongoDB (Atlas recommended) via Mongoose
- Hosting: Vercel

## Repository Structure

```
AsanaMeter/
  backend/                 # Legacy Express server (not used on Vercel)
  classification model/    # Training data and scripts (optional)
  frontend/                # App root when deploying to Vercel
    api/
      leaderboard.js           # GET /api/leaderboard?pose=...
      leaderboard/add-time.js  # POST /api/leaderboard/add-time
    public/
    src/
      pages/
        Yoga/                  # Pose detection, timer, UI
        Leaderboard/           # Leaderboard page
    package.json
  vercel.json               # For CRA SPA rewrites (move to frontend/ if project root set there)
```

## How It Works

1. The webcam stream runs locally in the browser.
2. MoveNet outputs 17 keypoints per frame (x, y, confidence).
3. Keypoints are centered (hips), scale-normalized, and flattened to a 34-dim vector.
4. A small TF.js classifier predicts the pose class; when confidence > threshold, the timer runs.
5. On stop, a POST request upserts the best time per user/pose.
6. The leaderboard page fetches sorted results per pose.

## API Endpoints (Serverless)

- GET `/api/leaderboard?pose=Vrikshasana`
  - Returns a sorted list of `{ position, name, time }` (desc by time)
- POST `/api/leaderboard/add-time`
  - Body: `{ userId, name, age, pose, time }`
  - Upserts best time for the user on that pose

## Environment Variables

- `MONGO_URI` (required): MongoDB connection string (Atlas recommended)

Examples:

- Local (dev only): `mongodb://localhost:27017/yogaGameDB`
- Atlas: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>?retryWrites=true&w=majority`

## Local Development

Prereqs: Node 18+, npm; optional local MongoDB if testing DB locally.

1. Install dependencies

```
cd frontend
npm install
# If not already present
npm install mongoose
```

2. Set env var for dev (optional when using local MongoDB)

- On Windows PowerShell (example):

```
$env:MONGO_URI="mongodb://localhost:27017/yogaGameDB"
```

3. Start the app (CRA dev server + serverless via Vercel CLI optional)

- Simple CRA run (API calls will fail unless deployed or using vercel dev):

```
npm start
```

- Recommended: run with Vercel dev to emulate serverless locally

```
npm install -g vercel
vercel dev
# open http://localhost:3000
```

## Deploying to Vercel

1. Push your repo to GitHub.
2. In Vercel, import the repo and set the Project Root to `frontend/`.
3. Build settings:
   - Framework Preset: React (or Other)
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Environment Variables: add `MONGO_URI` (Production and Preview).
5. Ensure serverless functions live in `frontend/api/`.
6. Place `vercel.json` inside `frontend/` with SPA rewrites:

```
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

7. Redeploy.

## Troubleshooting

- 404 on `/api/...`:
  - Project Root must be `frontend/` and functions must be in `frontend/api/`
  - Split endpoints into files: `leaderboard.js` and `leaderboard/add-time.js`
- 500 on API:
  - Check Vercel function logs
  - Ensure `MONGO_URI` is set and reachable (Atlas network access)
  - Ensure `mongoose` is listed in `frontend/package.json`
- CORS:
  - Not needed when frontend and API share the same Vercel domain

## Scripts

From `frontend/`:

- `npm start` – CRA dev server
- `npm run build` – production build
- `vercel dev` – run frontend and serverless locally

## Security & Future Work

- Add auth (JWT/magic links) to prevent name spoofing
- Validation (Zod) and rate limiting on serverless endpoints
- Connection reuse / pooling patterns in serverless
- Improve classifier and add more poses

## License

MIT
