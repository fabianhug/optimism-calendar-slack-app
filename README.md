# Optimism Governance Calendar Slack App

This Slack App sends notifications about Optimism Governance events from the official OP Governance Calendar. It provides:

- Weekly summaries of upcoming events (every Monday at 9:00 AM EST)
- Same-day event reminders (daily at 9:00 AM EST)
- Formatted messages including event title, time in EST, description, and meeting links
- `/getevents` slash command to manually check this week's events

## Setup Instructions

### 1. Slack App Setup

1. Create a new Slack App in your workspace
2. Add the following Bot Token Scopes:
   - `chat:write`
   - `chat:write.public`
   - `commands`
3. Create a Slash Command:
   - Command: `/getevents`
   - Request URL: `https://your-app-url/slack/events`
   - Description: "Get this week's Optimism Governance events"
   - Usage Hint: "Just type /getevents to see upcoming events"
4. Enable Socket Mode in your app settings
5. Install the app to your workspace
6. Note down the following credentials:
   - Bot User OAuth Token (`SLACK_BOT_TOKEN`)
   - Signing Secret (`SLACK_SIGNING_SECRET`)
   - App-Level Token (`SLACK_APP_TOKEN`) - Create one with `connections:write` scope

### 2. Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in the following variables:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_CHANNEL_ID=channel-to-post-to
PORT=3000
```

### 3. Installation and Running

1. Install dependencies:

```bash
pnpm install
```

2. Build the TypeScript code:

```bash
pnpm run build
```

3. Start the application:

```bash
pnpm start
```

For development with auto-reload:

```bash
pnpm run dev
```

## Features

- Monitors the official [Optimism Governance Calendar](https://calendar.google.com/calendar/embed?src=c_fnmtguh6noo6qgbni2gperid4k%40group.calendar.google.com)
- Sends weekly summaries every Monday at 9:00 AM EST
- Sends same-day reminders at 9:00 AM EST
- Includes links to the [Optimism Voting Platform](https://vote.optimism.io/)
- Formats messages with event details, times, and meeting links
- Handles both recurring and one-time events
- Properly handles timezone conversion to EST

## Project Structure

```
src/
├── app.ts           # Main app setup and command handlers
├── index.ts         # Application entry point
├── config/          # Configuration and environment variables
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── services/        # Core business logic
└── jobs/           # Scheduled tasks
```

## Contributing

Feel free to open issues or submit pull requests for any improvements.
