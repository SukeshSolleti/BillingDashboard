import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../services/userService";
import "../styles.css"; // Import Tailwind CSS styles

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false, // Initialize rememberMe state
  });

  const { email, password, rememberMe } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.login({ email, password });
      console.log(response);
      localStorage.setItem("token", response.token);
      // If rememberMe is true, store email and rememberMe state in local storage
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        // If not checked, remove email and rememberMe state from local storage
        localStorage.removeItem("email");
        localStorage.removeItem("rememberMe");
      }
      console.log("Logged in successfully");
      navigate("/dashboard"); // Change this to your desired route
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Sign in to your account
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
              placeholder="Email address"
              value={email}
              onChange={onChange}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
              placeholder="Password"
              value={password}
              onChange={onChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() =>
                  setFormData({ ...formData, rememberMe: !rememberMe })
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
