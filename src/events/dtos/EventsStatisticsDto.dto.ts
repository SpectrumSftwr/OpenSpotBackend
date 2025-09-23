export class EventsStatisticsDto {
  upcomingAccepted  : number;   // The Events that are Approved for Automation. 
  pending           : number;   // The Events that are Pending Approval.
  upcomingThisMonth : number;   // Number of events this month.
  yearToDate        : number;   // Number of events this year to date.
}
