import { App } from "@slack/bolt";
import { getNow, getWeekEnd, getTodayStart, getTomorrow } from "./utils/date";
import { fetchEvents } from "./services/events";
import { formatEventsResponse } from "./services/slack";
import { setupCronJobs } from "./jobs";
import { SLACK_CONFIG } from "./config";

// Initialize Slack app
const app = new App(SLACK_CONFIG);

// Slash command handler for /getevents
app.command("/getevents", async ({ ack, respond }) => {
  await ack();

  try {
    const now = getNow();
    const weekEnd = getWeekEnd(now);
    const todayStart = getTodayStart(now);
    const tomorrow = getTomorrow(now);

    console.log(
      "Fetching events from",
      todayStart.format("YYYY-MM-DD HH:mm:ss"),
      "to",
      tomorrow.format("YYYY-MM-DD HH:mm:ss")
    );

    // Get today's events (daily events only)
    const todayEvents = await fetchEvents(
      todayStart.toISOString(),
      tomorrow.toISOString(),
      true // Only include events that start today
    );

    // Get this week's upcoming events (including ongoing events)
    const weekEvents = await fetchEvents(
      todayStart.toISOString(),
      weekEnd.toISOString(),
      false // Include all events
    );

    // If no events at all, send a simple message
    if (weekEvents.length === 0) {
      await respond({
        text: "No upcoming events this week! 🎉",
        response_type: "in_channel",
      });
      return;
    }

    await respond(formatEventsResponse(todayEvents, weekEvents));
  } catch (error) {
    console.error("Error in /getevents command:", error);
    await respond({
      text: "Sorry, there was an error fetching the events. Please try again later.",
      response_type: "in_channel",
    });
  }
});

// Setup cron jobs
setupCronJobs(app);

export default app;
