const Inquiry = require("../models/inquiryModel");
const House = require("../models/houseModel");

exports.createInquiry = async (req, res) => {
  try {
    const { houseId, message, inquiryType } = req.body;

    if (req.session.user.role !== "viewer") {
      return res.status(403).json({ message: "Only viewers can send inquiries" });
    }

    if (!houseId) return res.status(400).json({ message: "houseId is required" });
    if (!message) return res.status(400).json({ message: "message is required" });
    if (!inquiryType) return res.status(400).json({ message: "inquiryType is required" });

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    if (house.status !== "available") {
      return res.status(400).json({ message: "This house is no longer available" });
    }

    const existingInquiry = await Inquiry.findOne({
      house: houseId,
      viewer: req.session.user.id,
      inquiryType,
      status: "pending"
    });

    if (existingInquiry) {
      return res.status(400).json({ message: "You already sent a pending inquiry for this house" });
    }

    const inquiry = await Inquiry.create({
      house: houseId,
      viewer: req.session.user.id,
      commissioner: house.commissioner,
      message,
      inquiryType
    });

    res.status(201).json({
      message: "Inquiry sent successfully",
      inquiry
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getViewerInquiries = async (req, res) => {
  try {
    if (req.session.user.role !== "viewer") {
      return res.status(403).json({ message: "Only viewers can view their inquiries" });
    }

    const inquiries = await Inquiry.find({ viewer: req.session.user.id })
      .populate("house")
      .populate("commissioner", "fullname email phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getCommissionerInquiries = async (req, res) => {
  try {
    if (req.session.user.role !== "commissioner") {
      return res.status(403).json({ message: "Only commissioners can view received inquiries" });
    }

    const inquiries = await Inquiry.find({ commissioner: req.session.user.id })
      .populate("house")
      .populate("viewer", "fullname email phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (inquiry.commissioner.toString() !== req.session.user.id) {
      return res.status(403).json({ message: "You can only update inquiries sent to you" });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      message: "Inquiry status updated successfully",
      inquiry
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};