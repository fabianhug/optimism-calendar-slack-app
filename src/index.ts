require("dotenv").config();
const { App } = require("@slack/bolt");
const { google } = require("googleapis");
const cron = require("node-cron");
const moment = require("moment-timezone");

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Configure Google Calendar API
const calendar = google.calendar("v3");
const CALENDAR_ID = "c_fnmtguh6noo6qgbni2gperid4k@group.calendar.google.com";
const VOTING_PLATFORM = "https://vote.optimism.io/";

interface CalendarEvent {
  summary: string;
  description?: string;
  hangoutLink?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
}

// Helper function to format event message
const formatEventMessage = (event: CalendarEvent) => {
  const start = moment(event.start.dateTime || event.start.date)
    .tz("Europe/Paris")
    .format("MMMM D, YYYY [at] HH:mm [CET]");

  let message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `📅 ${event.summary}`,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*When:* ${start}`,
        },
      },
    ],
  };

  if (event.description) {
    message.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Description:*\n${event.description}`,
      },
    });
  }

  if (event.hangoutLink) {
    message.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Meeting Link:* <${event.hangoutLink}|Join Meeting>`,
      },
    });
  }

  message.blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Voting Platform:* <${VOTING_PLATFORM}|Optimism Governance>`,
    },
  });

  return message;
};

// Function to fetch events
async function fetchEvents(timeMin: string, timeMax: string) {
  try {
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
      key: process.env.GOOGLE_API_KEY, // Use API key for public access
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Send weekly summary (every Monday at 9:00 AM CET)
cron.schedule(
  "0 9 * * 1",
  async () => {
    const now = moment().tz("Europe/Paris");
    const weekEnd = moment().tz("Europe/Paris").endOf("week");

    const events = await fetchEvents(now.toISOString(), weekEnd.toISOString());

    if (events.length > 0) {
      await app.client.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID,
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
          ...events.flatMap(
            (event: CalendarEvent) => formatEventMessage(event).blocks
          ),
        ],
      });
    }
  },
  {
    timezone: "Europe/Paris",
  }
);

// Send daily reminders (every day at 9:00 AM CET)
cron.schedule(
  "0 9 * * *",
  async () => {
    const today = moment().tz("Europe/Paris");
    const tomorrow = moment().tz("Europe/Paris").add(1, "day");

    const events = await fetchEvents(
      today.toISOString(),
      tomorrow.toISOString()
    );

    for (const event of events) {
      await app.client.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID,
        text: `🔔 Reminder: ${event.summary} today`,
        ...formatEventMessage(event),
      });
    }
  },
  {
    timezone: "Europe/Paris",
  }
);

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Optimism Calendar Slack app is running!");
})();
