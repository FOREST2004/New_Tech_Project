import { EventService } from "../../services/admin/event.service.js";

export class EventController {
  static async createEvent(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admin can create events" });
      }

      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Invalid token: user not found",
        });
      }

      const eventData = {
        ...req.body,
        organizationId: req.user.organizationId,
        createdById: req.user.id,
      };

      const event = await EventService.createEvent(eventData);
      res.json({ success: true, event });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getEventsList(req, res) {
    try {
      const { page, limit } = req.query;

      if (req.user.role !== "ADMIN") {
        return res.status(403).json({});
      }

      const filters = {
        ...req.query,
        organizationId: req.user.organizationId,
      };

      const result = await EventService.getEventsList(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getEventById(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admin can access" });
      }

      const event = await EventService.getEventById(parseInt(req.params.id));

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json({ success: true, event });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateEvent(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admin can update events" });
      }

      const eventId = parseInt(req.params.id);

      const event = await EventService.updateEvent(eventId, req.body);

      res.json({ success: true, event });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteEvent(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admin can delete events" });
      }

      const eventId = parseInt(req.params.id);
      await EventService.deleteEvent(eventId);

      res.json({ success: true, message: "Event deleted" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getEventRegistrations(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admin can access" });
      }

      const eventId = parseInt(req.params.id);
      const registrations = await EventService.getEventRegistrations(
        eventId,
        req.user.organizationId
      );

      res.json({ success: true, registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }



  static async updateRegistrationStatus(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can update registrations" });
    }

    const { updates } = req.body; 
    await EventService.updateRegistrationStatus(updates);

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

  static async getOngoingEvents(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admin can access" });
      }

      const events = await EventService.getOngoingEventsByOrganization(
        req.user.organizationId
      );

      res.json({ success: true, events });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
