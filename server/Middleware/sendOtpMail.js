import transporter from "../Config/mailer.js";

const sendOtpMail = async (req, res) => {
  try {
    if (!req.otpData) {
      return res.status(400).json({ message: "OTP data not found" });
    }

    const { email, otp, type } = req.otpData;

    const subject =
      type === "resend" ? "Carent | Resend OTP" : "Carent | OTP Verification";

    await transporter.sendMail({
      from: `"Carent" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>CarRent Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- HEADER -->
          <tr>
            <td style="background:#2563eb; padding:20px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">
                Car<span style="color:#facc15;">Rent</span>
              </h1>
              <p style="margin:6px 0 0; color:#e0e7ff; font-size:14px;">
                Premium Car Rental Service
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:30px;">
              <h2 style="color:#111827; font-size:22px; margin-bottom:10px;">
                Verify Your Email Address
              </h2>

              <p style="color:#374151; font-size:15px; line-height:1.6;">
                Thank you for registering with <strong>CarRent</strong>.
                Please use the One-Time Password (OTP) below to verify your email address.
              </p>

              <!-- OTP BOX -->
              <div style="margin:30px 0; text-align:center;">
                <span style="
                  display:inline-block;
                  background:#facc15;
                  color:#111827;
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:6px;
                  padding:15px 30px;
                  border-radius:8px;
                ">
                  ${otp}
                </span>
              </div>

              <p style="color:#374151; font-size:14px;">
                This OTP is valid for <strong>10 minutes</strong>.  
                Please do not share it with anyone for security reasons.
              </p>

              <p style="color:#374151; font-size:14px; margin-top:20px;">
                If you did not create an account, please ignore this email.
              </p>

              <p style="margin-top:30px; color:#111827; font-size:14px;">
                Regards,<br />
                <strong>CarRent Team</strong>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
              © ${new Date().getFullYear()} CarRent. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`,
    });

    // Send response after email is sent
    res.status(201).json({
      success: true,
      message: "User registered successfully. OTP sent to your email.",
      email,
    });
  } catch (error) {
    console.error("❌ Send OTP Mail Error:", error.message);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
};

export default sendOtpMail;
