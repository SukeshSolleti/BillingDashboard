import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../services/userService";
import "../styles.css"; // Import Tailwind CSS styles

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.register({
        username,
        email,
        password,
      });
      localStorage.setItem("token", response.token);
      console.log("Registered successfully");
      navigate("/dashboard"); // Change this to your desired route
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create an account
        </h2>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
              placeholder="Username"
              value={username}
              onChange={onChange}
            />
          </div>
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
              autoComplete="new-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
              placeholder="Password"
              value={password}
              onChange={onChange}
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
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

export default Register;
