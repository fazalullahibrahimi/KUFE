const express = require("express")
const { getNews, getSingleNews, createNews, updateNews, deleteNews } = require("../controllers/newsController")
const { protect } = require("../middleware/auth")
const { authorize } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", getNews)
router.get("/:id", getSingleNews)

// Protected routes
router.use(protect)

// Admin and faculty can create/update/delete news
router.post("/", authorize(roles.ADMIN, roles.FACULTY), createNews)

router.put("/:id", authorize(roles.ADMIN, roles.FACULTY), updateNews)

router.delete("/:id", authorize(roles.ADMIN), deleteNews)

module.exports = router

