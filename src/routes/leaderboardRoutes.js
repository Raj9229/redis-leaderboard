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

router.get("/",async (res, req ) => {
  try{
    const leaders = await redisClient.zRangeWithScore(
      LEADERBORD_KEY,
      0,
      9,
      {REV : true}
    );
    const result = leader.map((user,index)=>({
      rank: index +1,
      userId:user.value,
      score:user.score
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({error:
      "failed "
    });
  }
  
});


router.get("/:userId/rank", async (req, res) => {
  try {
    const { userId } = req.params;

    const rank = await redisClient.zRevRank(
      LEADERBOARD_KEY,
      userId
    );

    if (rank === null) {
      return res.status(404).json({
        error: "User not found on leaderboard"
      });
    }

    const score = await redisClient.zScore(
      LEADERBOARD_KEY,
      userId
    );

    res.json({
      userId,
      rank: rank + 1,
      score: Number(score)
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user rank" });
  }
});

module.export = router;