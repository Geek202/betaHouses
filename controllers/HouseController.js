const House = require("../models/houseModel");

exports.createHouse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      listingType,
      propertyType,
      bedrooms,
      bathrooms,
      size,
      images,
      negotiable
    } = req.body;

    if (req.session.user.role !== "commissioner") {
      return res.status(403).json({ message: "Only commissioners can create house listings" });
    }

    if (!title) return res.status(400).json({ message: "title is required" });
    if (!description) return res.status(400).json({ message: "description is required" });
    if (!price) return res.status(400).json({ message: "price is required" });
    if (!location) return res.status(400).json({ message: "location is required" });
    if (!listingType) return res.status(400).json({ message: "listingType is required" });
    if (!propertyType) return res.status(400).json({ message: "propertyType is required" });
    if (!size) return res.status(400).json({ message: "size is required" });
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const newHouse = await House.create({
      title,
      description,
      price,
      location,
      listingType,
      propertyType,
      bedrooms,
      bathrooms,
      size,
      images,
      negotiable,
      commissioner: req.session.user.id
    });

    res.status(201).json({
      message: "House created successfully",
      house: newHouse
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.find()
      .populate("commissioner", "fullname username email phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getSingleHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id)
      .populate("commissioner", "fullname username email phoneNumber");

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    res.status(200).json(house);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getCommissionerHouses = async (req, res) => {
  try {
    if (req.session.user.role !== "commissioner") {
      return res.status(403).json({ message: "Only commissioners can view their own listings" });
    }

    const houses = await House.find({ commissioner: req.session.user.id }).sort({ createdAt: -1 });

    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    if (house.commissioner.toString() !== req.session.user.id) {
      return res.status(403).json({ message: "You can only update your own house listing" });
    }

    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "House updated successfully",
      house: updatedHouse
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.deleteHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    if (house.commissioner.toString() !== req.session.user.id) {
      return res.status(403).json({ message: "You can only delete your own house listing" });
    }

    await House.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "House deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};