const express = require("express")
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getLatestEvents,
    uploadEventPhoto,
    resizeEventPhoto


 } = require("../controllers/eventController")
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
router.post("/", authorize(roles.ADMIN, roles.TEACHER),
uploadEventPhoto,
resizeEventPhoto,
createEvent
);

router.patch("/:id", authorize(roles.ADMIN, roles.TEACHER),
uploadEventPhoto,
resizeEventPhoto,
updateEvent
);

router.delete("/:id", authorize(roles.ADMIN), deleteEvent)

module.exports = router

