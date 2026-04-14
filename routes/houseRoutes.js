const express = require("express");
const router = express.Router();
const houseController = require("../controllers/HouseController");
const isAuthenticated = require("../middleware/auth");

router.post("/create", isAuthenticated, houseController.createHouse);
router.get("/", houseController.getAllHouses);
router.get("/my-houses", isAuthenticated, houseController.getCommissionerHouses);
router.get("/:id", houseController.getSingleHouse);
router.put("/update/:id", isAuthenticated, houseController.updateHouse);
router.delete("/delete/:id", isAuthenticated, houseController.deleteHouse);

module.exports = router;