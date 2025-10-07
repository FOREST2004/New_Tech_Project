import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getMyEvents = async (userId) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: {
        userId: userId,
        status: 'REGISTERED'
      },
      select: {
        id: true,
        attendance: true,
        createdAt: true,
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            startAt: true,
            endAt: true,
            registrationStartAt: true,
            registrationEndAt: true,
            maxAttendees: true,
            status: true,
            _count: {
              select: {
                registrations: {
                  where: {
                    status: 'REGISTERED'
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        event: {
          startAt: 'asc'
        }
      }
    });
    
    const result = registrations.map(reg => {
      const registeredCount = reg.event._count.registrations;
      const remainingSlots = reg.event.maxAttendees - registeredCount;
      
      const eventWithCount = {
        ...reg.event,
        registeredCount: registeredCount,
        remainingSlots: remainingSlots,
        attendance: reg.attendance,
        registrationId: reg.id
      };
      
      return eventWithCount;
    });
    
    return result;
  } catch (error) {
    throw error;
  }
};

export const getUpcomingEvents = async (organizationId, userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const events = await prisma.event.findMany({
      where: {
        organizationId: organizationId,
        status: 'REGISTRATION',
        NOT: {
          registrations: {
            some: {
              userId: userId,
              status: 'REGISTERED'
            }
          }
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        startAt: true,
        endAt: true,
        registrationStartAt: true,
        registrationEndAt: true,
        maxAttendees: true,
        status: true,
        _count: {
          select: {
            registrations: {
              where: {
                status: 'REGISTERED'
              }
            }
          }
        }
      },
      orderBy: {
        startAt: 'asc'
      },
      skip: skip,
      take: limit
    });
    
    const total = await prisma.event.count({
      where: {
        organizationId: organizationId,
        status: 'REGISTRATION',
        NOT: {
          registrations: {
            some: {
              userId: userId,
              status: 'REGISTERED'
            }
          }
        }
      }
    });
    
    const eventsWithRegistrationStatus = events.map(event => {
      const registeredCount = event._count.registrations;
      const remainingSlots = event.maxAttendees - registeredCount;
      
      const eventWithCount = {
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        startAt: event.startAt,
        endAt: event.endAt,
        registrationStartAt: event.registrationStartAt,
        registrationEndAt: event.registrationEndAt,
        maxAttendees: event.maxAttendees,
        status: event.status,
        registeredCount: registeredCount,
        remainingSlots: remainingSlots,
        isRegistered: false
      };
      
      return eventWithCount;
    });
    
    return {
      events: eventsWithRegistrationStatus,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw error;
  }
};

export const registerForEvent = async (userId, eventId) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: 'REGISTERED'
              }
            }
          }
        }
      }
    });
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    if (event.status !== 'REGISTRATION') {
      throw new Error('Event registration is not open');
    }
    
    if (event.maxAttendees && event._count.registrations >= event.maxAttendees) {
      throw new Error('Event is full');
    }
    
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      }
    });
    
    if (existingRegistration && existingRegistration.status === 'REGISTERED') {
      throw new Error('Already registered for this event');
    }
    
    const registration = await prisma.registration.upsert({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      },
      update: {
        status: 'REGISTERED'
      },
      create: {
        eventId: eventId,
        userId: userId,
        status: 'REGISTERED'
      }
    });
    
    return registration;
  } catch (error) {
    throw error;
  }
};

export const cancelEventRegistration = async (userId, eventId) => {
  try {
    const registration = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      },
      include: {
        event: {
          select: {
            registrationEndAt: true,
            status: true
          }
        }
      }
    });
    
    if (!registration || registration.status !== 'REGISTERED') {
      throw new Error('Registration not found');
    }
    
    if (registration.event.registrationEndAt && new Date() > registration.event.registrationEndAt) {
      throw new Error('Cannot cancel registration after registration deadline');
    }
    
    const updatedRegistration = await prisma.registration.update({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      },
      data: {
        status: 'CANCELLED'
      }
    });
    
    return updatedRegistration;
  } catch (error) {
    throw error;
  }
};