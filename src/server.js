require("dotenv").config();

const express = require("express");
const redisClient = require("./config/redis");

const postRoutes = require("/routes/postRoutes");
const leaderboardRoutes = require("/routes/leaderboardRoutes");

const app = express();

app.use(express.json());

app.use("/post", postRoutes);
app.use("/leaderboard", leaderboardRoutes);


async function startServer() {
  await redisClient.connect();

  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
  });
}

startServer().catch(console.error);