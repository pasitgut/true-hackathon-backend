import express from "express";

const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  const { name, phone } = req.body;
  const code = Math.floor(100000 + Math.random() * 9000000).toString();

  try {
    const userExists = await db.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const result = await db.query(
      "INSERT INTO users(name, phone, verification_code) VALUES($1, $2, $3) RETURNING *",
      [name, phone, code],
    );

    res
      .status(201)
      .json({ message: "Registered successfully", verification_code: code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
