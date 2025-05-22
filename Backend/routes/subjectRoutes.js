const express = require('express');
const router = express.Router();
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');

const { authMiddleware} = require('../middleware/authMiddleware');
const { authorize, checkPermission,requireRoles } = require("../middleware/roleCheck")
const roles = require('../config/roles');

// Public routes
router.get('/', getSubjects);
router.get('/:id', getSubjectById);

// Apply auth middleware for protected routes
router.use(authMiddleware);

// Protected routes (admin only)
router.post('/', requireRoles([roles.ADMIN,roles.TEACHER]), createSubject);
router.patch('/:id', requireRoles([roles.ADMIN,roles.TEACHER]), updateSubject);
router.delete('/:id', requireRoles([roles.ADMIN,roles.TEACHER]), deleteSubject);

module.exports = router;
