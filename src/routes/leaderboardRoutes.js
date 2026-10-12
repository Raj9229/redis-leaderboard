const express = require("express");
const redisClient = require("../config/redis");

const router = express.Router();


const LEADERBOARD_KEY = "leaderboard";

router.post("/score", async (req, res) => {
  try {
    const { userId, points } = req.body;

    if (
      typeof userId !== "string" ||
      !userId.trim() ||
      !Number.isSafeInteger(points) ||
      points <= 0
    ) {
      return res.status(400).json({
        error: "Valid userId and positive integer points required"
      });
    }
    const score = await redisClient.zIncrBy(LEADERBORD_KEY, points, userId);
    res.json({
      userId,
      score : Number(score)
    });
  } catch (err){
    res.status(500).json({error:
      "failed to update "
    });
  }
});



module.export = router;