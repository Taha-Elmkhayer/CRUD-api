import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `http://localhost:3000/auth/verify/${token}`;

  await transporter.sendMail({
    from: `"Note App" <no-reply@notes-app.com>`,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  });
}

export default transporter;
