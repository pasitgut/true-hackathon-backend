import express from "express";
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  const { inviterId, inviterPhone: invitePhone } = req.body;

  try {
    const inviter = await db.query("SELECT * FROM users WHERE id = $1", [
      inviterId,
    ]);

    if (!inviter.rows.length)
      return res.status(400).json({ message: "Inviter not found" });

    let familyId = inviter.rows[0].familyId;

    if (familyId) {
      const family = await db.quert(
        "INSERT INTO families DEFAULT VALUES RETURNING id",
      );
      familyId = family.rows[0].id;
      await db.query("UPDATE users SET family_id = $1 WHERE id = $1", [
        familyId,
        inviterId,
      ]);
    }

    await db.quert(
      "INSERT INTO invitations (inviter_id, invite_phoone) VALUES ($1, $2)",
      [inviterId, invitePhone],
    );

    res.status(200).json({ message: "Invitation send" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
