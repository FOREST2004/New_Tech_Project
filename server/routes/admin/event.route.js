import express from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import { EventController } from "../../controllers/admin/event.controller.js";



const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN'));


router.post("/create", EventController.createEvent);


router.get("/list", EventController.getEventsList);


router.get("/detail/:id", EventController.getEventById);


router.put("/edit/:id", EventController.updateEvent);


router.delete("/delete/:id", EventController.deleteEvent);  


router.get("/ongoing", EventController.getOngoingEvents);


router.get("/registrations/:id", EventController.getEventRegistrations);


router.put("/registrations/update-status", EventController.updateRegistrationStatus);

export default router;