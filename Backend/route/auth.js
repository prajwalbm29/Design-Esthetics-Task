const router = require('express').Router();

const formidableMiddleware = require('express-formidable');
const { registercontroller, accessPhotoController, loginController, verifyUserController, resetPasswordController, generateOtpController, verifyOtpController, updateProfileController, fetchUsersController, deleteUserController } = require('../controller/auth');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

router.post("/register", formidableMiddleware(), registercontroller);
router.get("/user-photo/:id", accessPhotoController);
router.post("/login", loginController);
router.get("/verify-login", isLoggedIn, verifyUserController);
router.get("/verify-admin", isLoggedIn, isAdmin, verifyUserController);
router.post("/generate-otp", generateOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/change-password", resetPasswordController);
router.put("/update-profile", isLoggedIn, updateProfileController);
router.get("/users", isLoggedIn, isAdmin, fetchUsersController);
router.delete("/delete/:id", isLoggedIn, isAdmin, deleteUserController);

module.exports = router;