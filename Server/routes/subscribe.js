import express from "express";
import { pool } from "../db.js";
import validator from "validator";
import { sendSubscriberWelcome } from "../services/mailer.js";

const router = express.Router();

// ✅ GET test route (browser)
router.get("/", (req, res) => {
  res.send("Subscribe route is working 🚀");
});

// ✅ POST subscribe route
router.post("/", async (req, res) => {
  const { email } = req.body;

  console.log("subscribeRoutes loaded");

  if (!validator.isEmail(email || "")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    await pool.query(
      `INSERT INTO subscribers (email)
       VALUES ($1)
       ON CONFLICT DO NOTHING`,
      [email]
    );

    await sendSubscriberWelcome(email);

    res.json({ success: true });
  } catch (err) {
    console.error("SUBSCRIBE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
