const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true
  },
  viewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  commissioner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  inquiryType: {
    type: String,
    enum: ["buy", "rent"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "responded", "closed"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Inquiry", inquirySchema);