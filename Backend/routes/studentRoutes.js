const express = require("express");
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  uploasStudentPhoto,
  resizeStudentPhoto,
  getStudentCount

} = require("../controllers/studentController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/roleCheck");
const roles = require("../config/roles");

const router = express.Router();

// Apply auth middleware to all routes

router.get("/onestudent",getStudent);
router.get("/studentcount",getStudentCount)
router.get("/",getStudents);
router.use(authMiddleware);
router.post("/", authorize(roles.ADMIN),
 uploasStudentPhoto,
 resizeStudentPhoto,
 createStudent);

router.put("/:id", authorize(roles.ADMIN), updateStudent);

router.delete("/:id", authorize(roles.ADMIN), deleteStudent);

module.exports = router;
