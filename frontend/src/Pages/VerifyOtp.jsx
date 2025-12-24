import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../Services/authServices.js";
import "../Styles/VerifyOtp.css"; // Import CSS file

const VerifyOtp = ({ email, setUser }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp({ email, otp });

      // Save user info in app state
      setUser(response.data.user);

      alert("Registration Successful ✅");
      navigate("/"); // Redirect to home
    } catch (err) {
      console.error(err.response);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h2 className="otp-title">Verify OTP</h2>
      {error && <p className="otp-error">{error}</p>}
      <form className="otp-form" onSubmit={handleVerifyOtp}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="otp-input"
        />
        <button disabled={loading} className="otp-btn">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
