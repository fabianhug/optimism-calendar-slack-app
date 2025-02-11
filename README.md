# Optimism Governance Calendar Slack App

This Slack App sends notifications about Optimism Governance events from the official OP Governance Calendar. It provides:

- Weekly summaries of upcoming events (every Monday at 9:00 AM CET)
- Same-day event reminders (daily at 9:00 AM CET)
- Formatted messages including event title, time in CET, description, and meeting links

## Setup Instructions

### 1. Google Calendar API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Create an API Key in the Credentials section
   - Optional: Restrict the API key to only Google Calendar API

### 2. Slack App Setup

1. Create a new Slack App in your workspace
2. Add the following Bot Token Scopes:
   - `chat:write`
   - `chat:write.public`
3. Install the app to your workspace
4. Note down the following credentials:
   - Bot User OAuth Token (`SLACK_BOT_TOKEN`)
   - Signing Secret (`SLACK_SIGNING_SECRET`)
   - App-Level Token (`SLACK_APP_TOKEN`) - Create one with `connections:write` scope

### 3. Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in the following variables:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_CHANNEL_ID=channel-to-post-to
GOOGLE_API_KEY=your-google-api-key
PORT=3000
```

### 4. Installation and Running

1. Install dependencies:

```bash
npm install
```

2. Build the TypeScript code:

```bash
npm run build
```

3. Start the application:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Features

- Monitors the official [Optimism Governance Calendar](https://calendar.google.com/calendar/embed?src=c_fnmtguh6noo6qgbni2gperid4k%40group.calendar.google.com)
- Sends weekly summaries every Monday at 9:00 AM CET
- Sends same-day reminders at 9:00 AM CET
- Includes links to the [Optimism Voting Platform](https://vote.optimism.io/)
- Formats messages with event details, times, and meeting links

## Contributing

Feel free to open issues or submit pull requests for any improvements.
