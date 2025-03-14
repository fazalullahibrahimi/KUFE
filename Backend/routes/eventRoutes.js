const express = require("express")
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController")
const { protect } = require("../middleware/auth")
const { authorize } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", getEvents)
router.get("/:id", getEvent)

// Protected routes
router.use(protect)

// Admin and faculty can create/update/delete events
router.post("/", authorize(roles.ADMIN, roles.FACULTY), createEvent)

router.put("/:id", authorize(roles.ADMIN, roles.FACULTY), updateEvent)

router.delete("/:id", authorize(roles.ADMIN), deleteEvent)

module.exports = router

