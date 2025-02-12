import dotenv from "dotenv";
dotenv.config();

export const CALENDAR_URL = process.env.CALENDAR_URL!;
export const VOTING_PLATFORM = "https://vote.optimism.io/";
export const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID!;
export const SLACK_CONFIG = {
  token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN!,
};

export const TIMEZONE = "America/New_York"; // TODO: Make this configurable
