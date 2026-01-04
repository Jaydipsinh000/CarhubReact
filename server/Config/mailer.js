import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Port 587 uses STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Standard TLS settings for modern cloud environments
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
  },
  debug: true,
  logger: true
});

console.log("--- Mailer Service Initialized ---");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Present" : "MISSING");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Present" : "MISSING");
console.log("--- End Check ---");

export default transporter;
