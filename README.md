# 📅 Optimism Governance Calendar Slack App

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://slack.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

This Slack App sends notifications about Optimism Governance events from the official OP Governance Calendar. It provides:

- 📊 Weekly summaries of upcoming events (every Monday at 9:00 AM EST)
- ⏰ Same-day event reminders (daily at 9:00 AM EST)
- 📝 Formatted messages including event title, time in EST, description, and meeting links
- 🤖 `/getevents` slash command to manually check this week's events

## 🎯 Demo

![Image](https://github.com/user-attachments/assets/0efbfd51-b117-412c-8460-ab0609e24001)

## 🚀 Setup Instructions

### 1️⃣ Slack App Setup

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

### 2️⃣ Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in the following variables:

```bash

# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_CHANNEL_ID=channel-to-post-to

# Server Configuration
PORT=3000

# Calendar Configuration
CALENDAR_URL=op-governance-calendar-url #pre-filled in the .example
```

### 3️⃣ Installation and Running

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

## ✨ Features

- 📅 Monitors the official [Optimism Governance Calendar](https://calendar.google.com/calendar/embed?src=c_fnmtguh6noo6qgbni2gperid4k%40group.calendar.google.com)
- 📊 Sends weekly summaries every Monday at 9:00 AM EST
- ⏰ Sends same-day reminders at 9:00 AM EST
- 🔗 Includes links to the [Optimism Voting Platform](https://vote.optimism.io/)
- 📝 Formats messages with event details, times, and meeting links
- 🔄 Handles both recurring and one-time events
- 🌎 Properly handles timezone conversion to EST

## 📁 Project Structure

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

## 🤝 Contributing

Feel free to open issues or submit pull requests for any improvements.

---
<div align="center">
Made with ❤️ for the Optimism Community
</div>
