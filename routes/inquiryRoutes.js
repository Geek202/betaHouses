const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/InquiryController");
const isAuthenticated = require("../middleware/auth");

router.post("/create", isAuthenticated, inquiryController.createInquiry);
router.get("/viewer", isAuthenticated, inquiryController.getViewerInquiries);
router.get("/commissioner", isAuthenticated, inquiryController.getCommissionerInquiries);
router.put("/update-status/:id", isAuthenticated, inquiryController.updateInquiryStatus);

module.exports = router;