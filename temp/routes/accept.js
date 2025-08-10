import express from "express";
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);

    if (!user.rows.length)
      return res.status(404).json({ message: "User not found" });

    const invite = await db.query(
      "SELECT * FROM invitations WHERE invite_phone = $1 AND status = $2",
      [phone, "pending"],
    );

    if (!invite.rows.length)
      return res.status(404).json({ message: "No pending invitation" });

    const inviter = await db.query("SELECT * FROM users WHERE id = $1", [
      invite.rows[0].inviter_id,
    ]);
    const familyId = inviter.rows[0].family_id;

    await db.query("UPDATE users SET family_id = $1 WHERE phone = $2", [
      familyId,
      phone,
    ]);
    await db.query("UPDATE invitations SET status = $1 WHERE id = $2", [
      "accepted",
      invite.rows[0].id,
    ]);

    res.status(200).json({ message: "Joined family successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
