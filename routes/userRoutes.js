const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { registerUser, loginUser, getUserInfo, logoutUser, updatePassword, updateImageUrl, changeProfileType, getAllProfiles, } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/myProfile", validateToken, getUserInfo);

router.post("/logout", validateToken, logoutUser);

router.put("/update-password", validateToken, updatePassword);

router.put("/upload-photo", validateToken, updateImageUrl);

router.put("/change-profile-type", validateToken, changeProfileType);

router.get("/profiles", validateToken, getAllProfiles);

module.exports = router;