const express = require("express");
const cors = require("cors");
require("dotenv").config();

const profileRoutes = require('./routes/profileRoutes');

const app = express()

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/profiles", profileRoutes)

app.get("/", (req, res) => {
  res.json({ status: "success", message: "API is running" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});