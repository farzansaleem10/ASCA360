const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const eventRoutes = require("./events");
const financeRoutes = require("./finances");
const complaintsRoutes = require("./complaints");
const announcementRoutes = require("./announcement");
const fundRoutes = require("./funds");
const alumniRoutes = require("./alumni");
const workReviewRoutes = require("./workReviews");
const placementReviewRoutes = require("./placementReview");
const reviewRoutes = require("./reviews");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://asca-360.vercel.app/"],
  methods: ["GET", "POST", "PUT", "DELETE"], // <-- Explicitly allow DELETE and PUT
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));

// === Database Connection ===
// IMPORTANT: You must add MONGODB_URI to your Vercel project's Environment Variables
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// === User Schema and Model ===
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["asca", "student", "committee", "mca-student"],
  },
});

const User = mongoose.model("User", userSchema);
app.get("/api", (req, res) => {
  res.send("ASCA Backend is Running!");
});

app.post("/api/register", async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const newUser = new User({ email, password, name, role });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password }); // 🔹 remove role filter
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.role === "asca") {
      return res.json({ success: true, role: "asca", name: user.name });
    } else if (user.role === "student") {
      return res.json({ success: true, role: "student", name: user.name });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
});

app.post("/api/student-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: "student" });
    if (user) {
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid student credentials" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
});

app.post("/api/committee-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: "committee" });
    if (user) {
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid committee credentials" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
});

app.post("/api/mca-students-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: "mca-student" });
    if (user) {
      return res.json({ success: true, role: user.role, name: user.name });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid MCA student credentials" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
});

app.use("/api/events", eventRoutes);
app.use("/api/finances", financeRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/work-reviews", workReviewRoutes);
app.use("/api/placement-reviews", placementReviewRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
