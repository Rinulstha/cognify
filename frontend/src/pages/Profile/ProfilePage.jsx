import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/pageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        toast.error("Failed to fetch profile data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

  <PageHeader title="Profile Settings" />

  {/* User Info Card */}
  <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">

    <h3 className="text-lg font-semibold text-slate-800">
      User Information
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

      {/* Username */}
      <div className="space-y-2">
        <label className="text-sm text-slate-500">Username</label>

        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
          <User className="w-5 h-5 text-emerald-600" />
          <p className="text-slate-800 font-medium truncate">
            {username}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm text-slate-500">Email Address</label>

        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
          <Mail className="w-5 h-5 text-emerald-600" />
          <p className="text-slate-800 font-medium truncate">
            {email}
          </p>
        </div>
      </div>

    </div>
  </div>

  {/* Change Password Card */}
  <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">

    <h3 className="text-lg font-semibold text-slate-800">
      Change Password
    </h3>

    <form onSubmit={handleChangePassword} className="space-y-5">

      {/* Current Password */}
      <div className="space-y-2">
        <label className="text-sm text-slate-500">
          Current Password
        </label>

        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500">
          <Lock className="w-5 h-5 text-slate-500" />
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full bg-transparent outline-none text-slate-700"
          />
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <label className="text-sm text-slate-500">
          New Password
        </label>

        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500">
          <Lock className="w-5 h-5 text-slate-500" />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full bg-transparent outline-none text-slate-700"
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="text-sm text-slate-500">
          Confirm New Password
        </label>

        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500">
          <Lock className="w-5 h-5 text-slate-500" />
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="w-full bg-transparent outline-none text-slate-700"
          />
        </div>
      </div>

      {/* Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={passwordLoading}
          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition disabled:opacity-50"
        >
          {passwordLoading ? "Changing..." : "Change Password"}
        </Button>
      </div>

    </form>
  </div>

</div>
  );
}

export default ProfilePage;
