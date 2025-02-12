import * as cron from "node-cron";
import { App } from "@slack/bolt";
import { getNow, getWeekEnd, getTomorrow } from "../utils/date";
import { fetchEvents } from "../services/events";
import { formatEventMessage } from "../services/slack";
import { SLACK_CHANNEL_ID, TIMEZONE } from "../config";

export function setupCronJobs(app: App) {
  // Send weekly summary (every Monday at 9:00 AM EST)
  cron.schedule(
    "0 9 * * 1",
    async () => {
      const now = getNow();
      const weekEnd = getWeekEnd(now);
      const events = await fetchEvents(
        now.toISOString(),
        weekEnd.toISOString()
      );

      if (events.length > 0) {
        await app.client.chat.postMessage({
          channel: SLACK_CHANNEL_ID,
          text: "🗓 This week's Optimism Governance Events",
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "🗓 This week's Optimism Governance Events",
                emoji: true,
              },
            },
            ...events.flatMap((event) => formatEventMessage(event).blocks),
          ],
        });
      }
    },
    {
      timezone: TIMEZONE,
    }
  );

  // Send daily reminders (every day at 9:00 AM EST)
  cron.schedule(
    "0 9 * * *",
    async () => {
      const now = getNow();
      const tomorrow = getTomorrow(now);
      const events = await fetchEvents(
        now.toISOString(),
        tomorrow.toISOString()
      );

      for (const event of events) {
        await app.client.chat.postMessage({
          channel: SLACK_CHANNEL_ID,
          text: `🔔 Reminder: ${event.summary} today`,
          ...formatEventMessage(event),
        });
      }
    },
    {
      timezone: TIMEZONE,
    }
  );
}
