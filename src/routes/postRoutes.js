const express = require("express");
const redisClient = require("../config/redis");

const router = express.Router();

router.post("/:id/view", async (req, res) => {
  try {
    const postId = req.params.id;

    const views = await redisClient.incr(
      `post:${postId}:views`
    );
     res.json({
      postId,
      views
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update views" });
  }
});

module.exports = router;