// src/components/ResetPasswordForm.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import userService from "../services/userService"; // Make sure this service has the reset password method

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onChangePassword = (e) => setPassword(e.target.value);
  const onChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await userService.resetPassword(token, password);
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Reset Password
        </h2>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={onChangePassword}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Reset Password
            </button>
          </div>
          {message && (
            <div className="text-center">
              <p className="text-sm text-gray-600">{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
