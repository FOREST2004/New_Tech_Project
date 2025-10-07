import * as EventService from "../../services/common/event/event.service.js";



export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await EventService.getMyEvents(userId);
    res.json(events);
  } catch (error) {
    console.error('Get my events error:', error);
    return res.status(400).json({ message: error.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await EventService.getUpcomingEvents(organizationId, userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error('Get upcoming events error:', error);
    return res.status(400).json({ message: error.message });
  }
};

export const registerEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = parseInt(req.params.eventId);
    
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    
    const registration = await EventService.registerForEvent(userId, eventId);
    res.json({ message: 'Successfully registered for event', registration });
  } catch (error) {
    console.error('Register event error:', error);
    return res.status(400).json({ message: error.message });
  }
};

export const cancelEventRegistration = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = parseInt(req.params.eventId);
    
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    
    const result = await EventService.cancelEventRegistration(userId, eventId);
    res.json({ message: 'Successfully cancelled registration', result });
  } catch (error) {
    console.error('Cancel registration error:', error);
    return res.status(400).json({ message: error.message });
  }
};