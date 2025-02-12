import axios from "axios";
import * as ical from "node-ical";
import moment from "moment-timezone";
import { CalendarEvent } from "../types";
import { cleanHtmlDescription } from "../utils/html";
import { CALENDAR_URL, TIMEZONE } from "../config";

function convertICalEvent(event: ical.VEvent): CalendarEvent {
  return {
    summary: event.summary || "Untitled Event",
    description: cleanHtmlDescription(event.description),
    start: {
      dateTime: event.start?.toISOString(),
      date: event.start?.toISOString(),
    },
  };
}

export async function fetchEvents(
  timeMin: string,
  timeMax: string,
  dailyEventsOnly: boolean = false
): Promise<CalendarEvent[]> {
  try {
    const response = await axios.get(CALENDAR_URL);
    const events = await ical.async.parseICS(response.data);

    const startDate = moment.tz(timeMin, TIMEZONE);
    const endDate = moment.tz(timeMax, TIMEZONE);

    console.log(
      "Filtering events between:",
      startDate.format("YYYY-MM-DD HH:mm:ss"),
      "and",
      endDate.format("YYYY-MM-DD HH:mm:ss"),
      `(${TIMEZONE})`,
      dailyEventsOnly ? "(daily events only)" : ""
    );

    const filteredEvents: CalendarEvent[] = [];

    for (const event of Object.values(events)) {
      if (event.type !== "VEVENT") continue;

      if (event.rrule) {
        await handleRecurringEvent(
          event as ical.VEvent & { rrule: any },
          startDate,
          endDate,
          dailyEventsOnly,
          filteredEvents
        );
        continue;
      }

      handleSingleEvent(
        event as ical.VEvent,
        startDate,
        endDate,
        dailyEventsOnly,
        filteredEvents
      );
    }

    return sortEventsByStartTime(filteredEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

async function handleRecurringEvent(
  event: ical.VEvent & { rrule: any },
  startDate: moment.Moment,
  endDate: moment.Moment,
  dailyEventsOnly: boolean,
  filteredEvents: CalendarEvent[]
) {
  console.log("Found recurring event:", {
    summary: event.summary,
    rrule: event.rrule.toString(),
    start: moment.tz(event.start, TIMEZONE).format("YYYY-MM-DD HH:mm:ss"),
  });

  try {
    const ruleString = event.rrule.toString();
    if (!ruleString.includes("UNTIL=")) {
      const untilDate = endDate.clone().add(1, "year");
      event.rrule.origOptions.until = untilDate.toDate();
    }

    const occurrences = event.rrule.between(
      startDate.toDate(),
      endDate.toDate(),
      true
    );

    for (const occurrence of occurrences) {
      const originalTz = event.start.tz || TIMEZONE;
      const occurrenceStart = moment.tz(occurrence, originalTz);

      if (
        occurrenceStart.isBetween(startDate, endDate, undefined, "[]") &&
        (!dailyEventsOnly || occurrenceStart.isSame(startDate, "day"))
      ) {
        filteredEvents.push({
          summary: event.summary || "Untitled Event",
          description: cleanHtmlDescription(event.description),
          start: {
            dateTime: occurrenceStart.toISOString(),
            date: occurrenceStart.toISOString(),
          },
        });
      }
    }
  } catch (error: any) {
    console.error("Error processing recurring event:", {
      summary: event.summary,
      error: error.message,
    });
  }
}

function handleSingleEvent(
  event: ical.VEvent,
  startDate: moment.Moment,
  endDate: moment.Moment,
  dailyEventsOnly: boolean,
  filteredEvents: CalendarEvent[]
) {
  const eventStart = moment.tz(event.start, TIMEZONE);
  const eventEnd = event.end
    ? moment.tz(event.end, TIMEZONE)
    : eventStart.clone().add(1, "hour");

  if (startDate.isSame(endDate, "day")) {
    const todayStart = startDate.clone().startOf("day");
    const todayEnd = startDate.clone().endOf("day");
    const startsToday = eventStart.isBetween(
      todayStart,
      todayEnd,
      "minute",
      "[]"
    );

    if (
      startsToday &&
      (!dailyEventsOnly || eventStart.isSame(todayStart, "day"))
    ) {
      filteredEvents.push(convertICalEvent(event));
    }
  } else {
    const isInRange =
      eventStart.isBetween(startDate, endDate, "minute", "[]") ||
      eventEnd.isBetween(startDate, endDate, "minute", "[]") ||
      (eventStart.isSameOrBefore(startDate) && eventEnd.isSameOrAfter(endDate));

    if (
      isInRange &&
      (!dailyEventsOnly || eventStart.isSame(startDate, "day"))
    ) {
      filteredEvents.push(convertICalEvent(event));
    }
  }
}

function sortEventsByStartTime(events: CalendarEvent[]): CalendarEvent[] {
  return events.sort((a, b) => {
    const aStart = moment(a.start.dateTime || a.start.date);
    const bStart = moment(b.start.dateTime || b.start.date);
    return aStart.valueOf() - bStart.valueOf();
  });
}
