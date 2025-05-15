import nodemailer from "nodemailer";

export default async ({ req, res, log, error }) => {
  try {
    const body = JSON.parse(req.body);
    const contactData = body?.payload || {};

    const name = contactData.name || "Unknown";
    const email = contactData.email || "Unknown";
    const message = contactData.message || "No message provided.";

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"GrowBuddy Contact" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📨 New Support Task Submitted by ${name}`,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; line-height: 1.5;">
          <h2 style="color: #2e7d32;">GrowBuddy Support Notification</h2>
          <p>You have received a new support task from a GrowBuddy user. Details below:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="margin: 1em 0; padding-left: 1em; border-left: 2px solid #ccc;">
            ${message}
          </blockquote>
          <hr />
          <p style="font-size: 12px; color: #888;">
            This message was sent automatically from the GrowBuddy Contact Us form.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    log("✅ Email sent successfully.");
    return res.empty();
  } catch (err) {
    error("❌ Email sending failed:", err.message);
    return res.send(`Error: ${err.message}`, 500);
  }
};
