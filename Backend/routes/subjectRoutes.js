const express = require('express');
const router = express.Router();
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');

const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const roles = require('../config/roles');

// Public routes
router.get('/', getSubjects);
router.get('/:id', getSubjectById);

// Apply auth middleware for protected routes
router.use(authMiddleware);

// Protected routes (admin only)
router.post('/', authorize(roles.ADMIN), createSubject);
router.put('/:id', authorize(roles.ADMIN), updateSubject);
router.delete('/:id', authorize(roles.ADMIN), deleteSubject);

module.exports = router;
