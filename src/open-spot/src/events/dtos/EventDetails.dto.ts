export class EventDetails {
  business_uid : string
  eventDate: Date;
  location: string;
  startTime: string; 
  endTime: string; 
  eventType:  string;
  guestCount: number;
  packageId: number;
  personalDetails: PersonalDetailsContextDto 
}


class PersonalDetailsContextDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredContact: string;
  comments: string | null;
}
