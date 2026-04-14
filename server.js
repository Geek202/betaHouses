require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const houseRoutes = require("./routes/houseRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB connection error:", err));

app.use("/auth", authRoutes);
app.use("/houses", houseRoutes);
app.use("/inquiries", inquiryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});