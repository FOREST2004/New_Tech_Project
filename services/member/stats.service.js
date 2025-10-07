import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMemberStats = async (userId) => {
  try {
  
    const registrations = await prisma.registration.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: {
          select: {
            status: true,
            startAt: true,
            endAt: true,
            title: true 
          }
        }
      }
    });




    const registrationEvents = registrations.filter(reg => 
      reg.event.status === 'REGISTRATION'
    ).length;
    
    const readyEvents = registrations.filter(reg => 
      reg.event.status === 'READY'
    ).length;
    
    const ongoingEvents = registrations.filter(reg => 
      reg.event.status === 'ONGOING'
    ).length;
    
    const completedEvents = registrations.filter(reg => 
      reg.event.status === 'COMPLETED'
    ).length;

    const result = {
      totalRegistrations: registrationEvents, 
      ready: readyEvents,                   
      ongoing: ongoingEvents,              
      completed: completedEvents           
    };


    return result;
  } catch (error) {
    console.error('Error getting member stats:', error);
    throw new Error('Failed to get member statistics: ' + error.message);
  }
};