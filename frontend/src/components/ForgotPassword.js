import React, { useState } from "react";
import { Link } from "react-router-dom";
import userService from "../services/userService";
import "../styles.css"; // Import Tailwind CSS styles
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.forgotPassword(email);
      if (response && response.data) {
        setMessage(response.data.message);
        setTimeout(() => navigate("/login"), 20000);
      } else {
        setMessage("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage(
          "An error occurred while sending the reset password email. Please try again later."
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Forgot Password
        </h2>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
              placeholder="Enter your email address"
              value={email}
              onChange={onChange}
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
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
