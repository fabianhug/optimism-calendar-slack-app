export interface CalendarEvent {
  summary: string;
  description?: string;
  hangoutLink?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
}
