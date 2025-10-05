import { Prisma } from "@prisma/client";

export type BookingDetailsWithRequestDetails = Prisma.BookingDetailsGetPayload<{
  include: { 
    request : true 
  }
}>;

