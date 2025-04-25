const express = require("express")
const { getNews, getSingleNews, createNews, updateNews, deleteNews,uploadNewstPhoto,resizeNewsPhoto } = require("../controllers/newsController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { authorize } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", getNews)
router.get("/:id", getSingleNews)

// Protected routes
router.use(authMiddleware)

// Admin and faculty can create/update/delete news
router.post("/", authorize(roles.ADMIN, roles.FACULTY),
uploadNewstPhoto,
resizeNewsPhoto,
createNews
);

router.patch("/:id", authorize(roles.ADMIN, roles.FACULTY),
uploadNewstPhoto,
resizeNewsPhoto,
updateNews)

router.delete("/:id", authorize(roles.ADMIN), deleteNews)

module.exports = router

