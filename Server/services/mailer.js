import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS,
  },
});

// ── Auto reply to user ─────────────────────────────
export async function sendUserConfirmation(email, name) {
  await transporter.sendMail({
    from: `"AzureServices" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "We received your request 🚀",
    html: `
      <h2>Hi ${name},</h2>
      <p>Thanks for reaching out.</p>
      <p>Our Azure engineers will contact you within <b>24 hours</b>.</p>
      <br/>
      <p>— AzureFlow Team</p>
    `,
  });
}

// ── Notify you (admin email) ───────────────────────
export async function sendAdminNotification(data) {
  await transporter.sendMail({
    from: `"AzureFlow" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    subject: "New Consultation Request",
    html: `
      <h3>New Lead</h3>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Service:</b> ${data.service}</p>
      <p><b>Message:</b><br/>${data.message}</p>
    `,
  });
}

// ── Subscriber email ───────────────────────────────
export async function sendSubscriberWelcome(email) {
  await transporter.sendMail({
    from: `"AzureFlow" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "You're subscribed 🎉",
    html: `
      <h2>Welcome!</h2>
      <p>You’re now subscribed to AzureServices updates.</p>
    `,
  });
}
