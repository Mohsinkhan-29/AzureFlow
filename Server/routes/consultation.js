import express from "express";
import { pool } from "../db.js";
import { sanitize, validateConsultation } from "../middleware/validate.js";
import {
  sendUserConfirmation,
  sendAdminNotification,
} from "../services/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;

  // ✅ Validate input
  const errors = validateConsultation(data);
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  // ✅ Sanitize input
  const cleaned = {
    name: sanitize(data.name),
    email: sanitize(data.email),
    company: sanitize(data.company),
    phone: sanitize(data.phone),
    service: data.service,
    company_size: data.company_size,
    budget: data.budget,
    priority: data.priority,
    message: sanitize(data.message),
  };

  try {
    // ✅ Insert into DB
    await pool.query(
      `INSERT INTO consultations
      (name,email,company,phone,service,company_size,budget,priority,message)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        cleaned.name,
        cleaned.email,
        cleaned.company,
        cleaned.phone,
        cleaned.service,
        cleaned.company_size,
        cleaned.budget,
        cleaned.priority,
        cleaned.message,
      ]
    );

    // ✅ Send emails WITHOUT breaking API if they fail
    Promise.all([
      sendUserConfirmation(cleaned.email, cleaned.name),
      sendAdminNotification(cleaned),
    ]).catch((err) => {
      console.error("Email error:", err);
    });

    // ✅ Always respond success after DB insert
    res.json({ success: true });

  } catch (err) {
    console.error("CONSULTATION ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
