import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials.",
      );
      toast.error(err.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
  {/* Background grid */}
  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

  {/* Content wrapper */}
  <div className="relative w-full max-w-md px-6">
    
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg mb-4">
          <BrainCircuit strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-semibold text-slate-800">Welcome back</h1>
        <p className="text-slate-500 text-sm">Sign in to continue your journey</p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${focusedField === "email" ? "text-emerald-500" : "text-slate-400"}`} strokeWidth={2} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
          <div className="relative">
            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${focusedField === "password" ? "text-emerald-500" : "text-slate-400"}`} strokeWidth={2} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="**********"
            />
          </div>
        </div>

      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 transition"
      >
        {loading ? "Signing in..." : (
          <>
            Sign in
            <ArrowRight strokeWidth={2.5} />
          </>
        )}
      </button>
    </div>

    {/* Footer */}
    <div className="text-center mt-6 text-sm text-slate-500">
      Don't have an account?{" "}
      <Link to="/register" className="text-emerald-500 hover:underline">
        Sign up
      </Link>
    </div>
  </div>

  {/* Bottom text */}
  <p className="absolute bottom-4 text-xs text-slate-400 text-center w-full">
    By continuing, you agree to our Terms & Privacy Policy
  </p>
</div>
  );
}

export default LoginPage;