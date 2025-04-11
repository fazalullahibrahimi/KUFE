const express = require("express")
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getLatestEvents } = require("../controllers/eventController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { authorize } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", getEvents)
router.get("/:id", getEvent)
router.get("/latest", getLatestEvents);

// Protected routes
router.use(authMiddleware)

// Admin and faculty can create/update/delete events
router.post("/", authorize(roles.ADMIN, roles.FACULTY), createEvent)

router.put("/:id", authorize(roles.ADMIN, roles.FACULTY), updateEvent)

router.delete("/:id", authorize(roles.ADMIN), deleteEvent)

module.exports = router

