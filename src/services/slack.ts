import { CalendarEvent } from "../types";
import { formatEventDate } from "../utils/date";
import { VOTING_PLATFORM } from "../config";
import { RespondArguments } from "@slack/bolt";

export function formatEventMessage(event: CalendarEvent) {
  const start = formatEventDate(event.start.dateTime || event.start.date || "");

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

  return message;
}

export function formatEventsResponse(
  todayEvents: CalendarEvent[],
  weekEvents: CalendarEvent[]
): RespondArguments {
  const blocks = [];

  // Add today's events section if there are any
  if (todayEvents.length > 0) {
    blocks.push(
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🔔 Today's Events",
          emoji: true,
        },
      },
      ...todayEvents.flatMap((event) => formatEventMessage(event).blocks),
      {
        type: "divider",
      }
    );
  }

  // Add weekly events section
  blocks.push(
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🗓 This week's Optimism Governance Events",
        emoji: true,
      },
    },
    ...weekEvents.flatMap((event) => formatEventMessage(event).blocks),
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Voting Platform:* <${VOTING_PLATFORM}|Optimism Governance>`,
      },
    }
  );

  return {
    text: "Optimism Governance Events",
    blocks,
    response_type: "in_channel" as const,
  };
}
