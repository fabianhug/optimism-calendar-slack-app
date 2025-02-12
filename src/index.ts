import app from "./app";

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Optimism Calendar Slack app is running!");
})();
