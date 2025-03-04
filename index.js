require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-service.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "ikrus3d.appspot.com", // Ensure this is correct
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || Math.floor(Math.random() * (60000 - 5001) + 5001);


// Mock Data for GET /models
const mockModels = [
  { id: "1", name: "Car Model", url: "https://example.com/car.glb" },
  { id: "2", name: "Building Model", url: "https://example.com/building.glb" },
];

// Endpoint: Fetch stored 3D models
app.get("/models", async (req, res) => {
  try {
    const modelsSnapshot = await db.collection("models").get();
    const models = modelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (models.length === 0) {
      return res.json(mockModels); // Return mock data if database is empty
    }

    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

// Endpoint: Upload a 3D model
app.post("/upload", async (req, res) => {
  try {
    const { name, url, description } = req.body;

    if (!name || !url || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newModel = { name, url, description, createdAt: new Date().toISOString() };
    const docRef = await db.collection("models").add(newModel);

    res.status(201).json({ id: docRef.id, ...newModel });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload model" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
