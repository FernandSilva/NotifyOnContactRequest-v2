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
      to: process.env.ADMIN_EMAIL, // ✅ Make sure this is set in .env!
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
        <hr />
        <p style="font-size: 12px; color: #888;">
          You received this message via the GrowBuddy Contact Us form.
        </p>
      `,
    };

    // ✅ Send the email
    await transporter.sendMail(mailOptions);

    log("✅ Email sent successfully.");
    return res.empty(); // ✅ Use 'res' not 'context.res'
  } catch (err) {
    error("❌ Email sending failed:", err.message);
    return res.send(`Error: ${err.message}`, 500);
  }
};
