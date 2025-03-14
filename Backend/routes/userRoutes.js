const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController.js');
const { authMiddlewarey, authorizeAdmin } = require('../middleware/authMiddleware'); // ✅ Corrected import

// Public routes
router.post('/register', 
  userController.registerUser,
  userController.uploadUserPhoto, 
  userController.resizeUserPhoto
);
router.post('/login', userController.loginUser);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword/:token', userController.resetPassword);

// Protected routes (require authentication)
router.use(authMiddlewarey); // ✅ Corrected function name

router.post('/logout', userController.logoutCurrentUser);
router.get('/profile', userController.getCurrentUserProfile);
router.patch('/profile', userController.updateCurrentUserProfile);
router.patch('/updatePassword', userController.updatePassword);
router.patch('/updatePhoto', 
  userController.uploadUserPhoto, 
  userController.resizeUserPhoto, 
  userController.updateUserPhoto
);

// Contact routes
router.post('/contacts', userController.addContact); 
router.patch('/contacts/:contactId', userController.updateContact); 
router.delete('/contacts/:contactId', userController.removeContact); 
router.get('/contacts', userController.getAllContacts); 

// Admin routes
router.use(authorizeAdmin);

router.get('/', userController.getAllUsers);
router.route('/:id')
  .get(userController.findUserByID)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserByID);

module.exports = router;
