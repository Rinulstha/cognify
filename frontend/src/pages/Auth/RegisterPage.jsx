import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { User, BrainCircuit, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
  
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length <6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authService.register(username, email, password);
      toast.success("Registration is successfull! Please Login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.message || "Failed to register. Please try again.",
      );
      toast.error(err.message || "Failed to register.");
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

    {/* Card */}
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 p-8">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg mb-4">
          <BrainCircuit strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-semibold text-slate-800">Create an account</h1>
        <p className="text-slate-500 text-sm">
          Start your AI-powered learning journey today!
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5">

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
          <div className="relative">
            <User
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                focusedField === "username" ? "text-emerald-500" : "text-slate-400"
              }`}
              strokeWidth={2}
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="yourusername"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <div className="relative">
            <Mail
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                focusedField === "email" ? "text-emerald-500" : "text-slate-400"
              }`}
              strokeWidth={2}
            />
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
            <Lock
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                focusedField === "password" ? "text-emerald-500" : "text-slate-400"
              }`}
              strokeWidth={2}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="********"
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
        {loading ? "Creating account..." : (
          <>
            Create account
            <ArrowRight strokeWidth={2.5} />
          </>
        )}
      </button>
    </div>

    {/* Footer */}
    <div className="text-center mt-6 text-sm text-slate-500">
      Already have an account?{" "}
      <Link to="/login" className="text-emerald-500 hover:underline">
        Sign in
      </Link>
    </div>
  </div>

  {/* Bottom text */}
  <p className="absolute bottom-4 text-xs text-slate-400 text-center w-full">
    By continuing, you agree to our Terms & Privacy Policy
  </p>
</div>
  )
}

export default RegisterPage