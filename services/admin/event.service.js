import { PrismaClient } from "@prisma/client";
import { NotificationService } from "../common/notification/notification.service.js";

const prisma = new PrismaClient();

export class EventService {

  static calculateEventStatus({
    initialStatus,
    registrationStartAt,
    registrationEndAt,
    startAt,
    endAt,
    registeredCount = 0,
    minAttendees = 0,
    maxAttendees = 0,
  }) {
    if (initialStatus === "CANCELLED") {
      return "CANCELLED";
    }

    const now = new Date();
    const registrationStart = registrationStartAt ? new Date(registrationStartAt) : null;
    const registrationEnd = registrationEndAt ? new Date(registrationEndAt) : null;
    const eventStart = startAt ? new Date(startAt) : null;
    const eventEnd = endAt ? new Date(endAt) : null;

  
    if (registrationStart && now < registrationStart) {
      return "DRAFT";
    }

   
    if (registrationStart && registrationEnd && now >= registrationStart && now <= registrationEnd) {
      return "REGISTRATION";
    }

  
    if (registrationEnd && now > registrationEnd && eventStart && now < eventStart) {
      if (minAttendees > 0 && registeredCount < minAttendees) {
        return "CANCELLED";
      }
      return "READY";
    }

   
    if (eventStart && eventEnd && now >= eventStart && now <= eventEnd) {
      return "ONGOING";
    }


    if (eventEnd && now > eventEnd) {
      return "COMPLETED";
    }

  
    return initialStatus || "DRAFT";
  }

  static async createEvent(eventData) {
    const {
      title,
      description,
      location,
      minAttendees,
      maxAttendees,
      startAt,
      endAt,
      deposit,
      status,
      registrationStartAt,
      registrationEndAt,
      organizationId,
      createdById,
    } = eventData;
  
    const correctStatus = this.calculateEventStatus({
      initialStatus: status,  
      registrationStartAt,
      registrationEndAt,
      startAt,
      endAt,
    });
  
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        minAttendees,
        maxAttendees,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        registrationStartAt: registrationStartAt
          ? new Date(registrationStartAt)
          : null,
        registrationEndAt: registrationEndAt
          ? new Date(registrationEndAt)
          : null,
        deposit: deposit,
        status: correctStatus,
        organizationId,
        createdById,
      },
      include: {  
        organization: true,
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    // Tự động tạo notification cho tất cả members trong organization
    try {
      await NotificationService.createEventNotification(event);
  
    } catch (notificationError) {
      console.error("❌ Failed to create notifications for event:", notificationError);
      // Không throw error để không ảnh hưởng đến việc tạo event
    }
  
    return event;
  }

  static async getEventsList(filters) {
    const {
      name,
      location,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      organizationId,
    } = filters;
  
    const where = {};
    
    if (organizationId) {
      where.organizationId = organizationId;
    }
  
    if (name) where.title = { contains: name, mode: "insensitive" };
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (status) where.status = status;
    if (startDate || endDate) where.startAt = {};
    if (startDate) where.startAt.gte = new Date(startDate);
    if (endDate) where.startAt.lte = new Date(endDate);
  
    
    
    const allEvents = await prisma.event.findMany({
      where,
      select: {
        id: true,
        status: true,
        registrationStartAt: true,
        registrationEndAt: true,
        startAt: true,
        endAt: true,
        minAttendees: true,
        maxAttendees: true,
        _count: {
          select: {
            registrations: {
              where: {
                status: {
                  in: ['REGISTERED', 'ATTENDED']
                }
              }
            }
          }
        }
      },
    });

    const updatePromises = allEvents.map(async (event) => {
      const registeredCount = event._count.registrations;
      
      const correctStatus = this.calculateEventStatus({
        initialStatus: event.status,
        registrationStartAt: event.registrationStartAt,
        registrationEndAt: event.registrationEndAt,
        startAt: event.startAt,
        endAt: event.endAt,
        registeredCount: registeredCount,
        minAttendees: event.minAttendees || 0,
        maxAttendees: event.maxAttendees || 0,
      });

      if (correctStatus !== event.status) {
        return prisma.event.update({
          where: { id: event.id },
          data: { status: correctStatus },
        });
      }
      return null;
    });
  
    
    await Promise.all(updatePromises);
  

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        location: true,
        startAt: true,
        endAt: true,
        registrationStartAt: true,
        registrationEndAt: true,
        status: true,
        deposit: true,
        maxAttendees: true, 
        _count: {
          select: {
            registrations: {
              where: {
                status: {
                  in: ['REGISTERED', 'ATTENDED']
                }
              }
            }
          }
        }
      },
    });
  
    const total = await prisma.event.count({ where });

    const eventsWithCount = events.map(event => ({
      ...event,
      registeredCount: event._count.registrations
    }));
  
    return {
      events: eventsWithCount,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  static async getEventById(eventId) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organization: true,
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            registrations: {
              where: {
                status: {
                  in: ['REGISTERED', 'ATTENDED']
                }
              }
            }
          }
        }
      },
    });

    if (event) {
      event.registeredCount = event._count.registrations;
    }

    return event;
  }

  static async updateEvent(eventId, updateData) {
    const {
      title,
      description,
      location,
      minAttendees,
      maxAttendees,
      startAt,
      endAt,
      registrationStartAt,
      registrationEndAt,
      deposit,
      status,
    } = updateData;

    const correctStatus = this.calculateEventStatus({
      initialStatus: status,
      registrationStartAt,
      registrationEndAt,
      startAt,
      endAt,
    });
  
    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        location,
        minAttendees,
        maxAttendees,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        registrationStartAt: registrationStartAt
          ? new Date(registrationStartAt)
          : null,
        registrationEndAt: registrationEndAt
          ? new Date(registrationEndAt)
          : null,
        deposit: deposit ? parseFloat(deposit) : 0,
        status: correctStatus,
      },
      include: {  
        organization: true,
        createdBy: {
          select: {
            id: true,
            fullName: true,  
            email: true
          }
        }
      }
    });
  
    return event;
  }

  static async deleteEvent(eventId) {
    await prisma.event.delete({
      where: { id: eventId },
    });
  }

  static async getEventRegistrations(eventId) {
    try {
      const registrations = await prisma.registration.findMany({
        where: { eventId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      return registrations;
    } catch (error) {
      throw error;
    }
  }

  static async updateRegistrationStatus(updates) {
    await Promise.all(
      updates.map((u) =>
        prisma.registration.update({
          where: { id: parseInt(u.registrationId) },
          data: { 
            attendance: u.attended,
            depositPaid: u.depositPaid
          },
        })

      )
    );
  }

  static async getOngoingEventsByOrganization(organizationId) {
    const events = await prisma.event.findMany({
      where: {
        organizationId,
        status: "ONGOING",
      },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: {
                  in: ['REGISTERED', 'ATTENDED']
                }
              }
            }
          }
        }
      },
      orderBy: {
        startAt: "asc",
      },
    });

    return events.map(event => ({
      ...event,
      registeredCount: event._count.registrations
    }));
  }
}
