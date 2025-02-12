declare module "ical-parser" {
  export interface VEvent {
    summary?: string;
    description?: string;
    dtstart?: {
      value: string;
    };
  }

  export interface Calendar {
    events?: Record<string, VEvent>;
  }

  export function parseICS(icsData: string): Promise<Calendar>;
}
