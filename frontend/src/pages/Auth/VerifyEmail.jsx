import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verify = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`
        );
        setStatus("success");
        toast.success(res.data.message || "Email verified successfully");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        setStatus("error");
        toast.error(
          err.response?.data?.error || "Verification failed. Try again."
        );
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      {status === "verifying" && <p>Verifying your email...</p>}
      {status === "success" && <p>✅ Email verified! Redirecting to login...</p>}
      {status === "error" && <p>❌ Verification link is invalid or expired.</p>}
    </div>
  );
};

export default VerifyEmail;