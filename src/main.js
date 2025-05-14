import sdk from "node-appwrite";

export default async ({ req, log, error }) => {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);
  const functions = new sdk.Functions(client);

  try {
    const body = JSON.parse(req.body);

    const contactData = body?.payload || {};

    const name = contactData.name || "Unknown";
    const email = contactData.email || "Unknown";
    const message = contactData.message || "No message provided.";

    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await functions.createExecution(process.env.EMAIL_FUNCTION_ID, JSON.stringify({
      to: process.env.ADMIN_EMAIL,
      subject: `GrowBuddy Contact Form Submission from ${name}`,
      html: emailContent,
    }), true);

    log("Email notification triggered via function execution.");
  } catch (err) {
    error("Error in notify-on-contact-request function", err.message);
  }
};

