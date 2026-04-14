const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  listingType: {
    type: String,
    enum: ["sale", "rent"],
    required: true
  },
  propertyType: {
    type: String,
    enum: ["house", "apartment", "villa", "studio", "land"],
    required: true
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  negotiable: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["available", "sold", "rented"],
    default: "available"
  },
  commissioner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("House", houseSchema);