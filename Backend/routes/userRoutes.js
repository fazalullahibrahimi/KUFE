const express = require("express")
const router = express.Router()

const userController = require("../controllers/userController.js")
const { authMiddleware, authorizeAdmin } = require("../middleware/authMiddleware") // Corrected import

// Public routes
router.post("/register",
   userController.uploadUserPhoto,
   userController.resizeUserPhoto,
   userController.registerUser
  );
router.post("/login", userController.loginUser);
router.post("/forgotpassword", userController.forgotPassword);
router.post("/resetpassword/:token", userController.resetPassword);


router.post("/verify-email-otp", userController.verifyEmailWithOTP)
router.get("/verify-email/:token", userController.verifyEmail)
router.post("/resend-verification-otp", userController.resendVerificationOTP)
router.get('/justNameOfComiteeMembers', userController.getAllCommitteeMembers);
router.get("/check-admin-exists", userController.checkAdminExists);
// Protected routes (require authentication)
router.use(authMiddleware) // Corrected middleware name

router.post("/logout", userController.logoutCurrentUser)
router.get("/profile", userController.getCurrentUserProfile)
router.patch(
  "/profile",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateCurrentUserProfile,
);
router.patch("/password", userController.updatePassword)
router.patch("/photo", 
  userController.uploadUserPhoto, 
  userController.resizeUserPhoto, 
  userController.updateUserPhoto);
// Admin routes
router.use(authorizeAdmin);

router.get("/", userController.getAllUsers);
router
  .route("/:id")
  .get(userController.findUserByID)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserByID);

module.exports = router



// http://localhost:4400/api/v1/user/justNameOfComiteeMembers this route for to give just name of user wtich is role is commitee Members