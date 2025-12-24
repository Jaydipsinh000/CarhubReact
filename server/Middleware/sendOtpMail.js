import transporter from "../Config/mailer.js";

const sendOtpMail = async (req, res, next) => {
  try {
    if (!req.otpData) {
      return res.status(400).json({ message: "OTP data not found" });
    }

    const { email, otp, type } = req.otpData;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email or OTP missing" });
    }

    const subject =
      type === "resend"
        ? "Carent | Resend OTP"
        : "Carent | OTP Verification";

    await transporter.sendMail({
      from: `"Carent" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px">
        <table width="600" style="background:#fff;border-radius:8px">
          <tr>
            <td style="background:#0d6efd;padding:20px;text-align:center;color:#fff">
              <h1>Carent</h1>
              <p>India’s Trusted Online Car Market</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px">
              <h2>Email Verification</h2>
              <p>Use the OTP below to verify your email.</p>
              <div style="text-align:center;margin:25px 0">
                <span style="
                  font-size:28px;
                  font-weight:bold;
                  letter-spacing:6px;
                  background:#f1f5ff;
                  color:#0d6efd;
                  padding:15px 30px;
                  border-radius:6px;
                  display:inline-block;
                ">
                  ${otp}
                </span>
              </div>
              <p>OTP valid for <b>10 minutes</b>. Do not share.</p>
              <p>Regards,<br><b>Carent Team</b></p>
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

    next();
  } catch (error) {
    console.error("❌ Send OTP Mail Error:", error.message);
    return res.status(500).json({ message: "Email sending failed" });
  }
};

export default sendOtpMail;
