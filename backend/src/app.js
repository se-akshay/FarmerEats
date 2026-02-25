const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "FarmerEats Backend",
    message: "FarmerEats API running.",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "FarmerEats Backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/assignment/user", authRoutes);

module.exports = app;
