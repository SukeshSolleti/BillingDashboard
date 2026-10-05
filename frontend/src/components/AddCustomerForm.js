import React, { useState } from "react";

const AddCustomerForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    city: "", // City will be selected from dropdown
    phoneNo: "",
  });
  const [phoneError, setPhoneError] = useState(""); // State for phone number error message

  const { name, city, phoneNo } = formData;

  const cities = [
    "Adoni",
    "Pattikonda",
    "Devanakonda",
    "Siruguppa",
    "Holagunda",
  ]; // Example cities, you can add more

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "phoneNo") {
      setPhoneError(""); // Clear phone number error when user starts typing again
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regular expression for validating 10-digit phone number
    const phoneRegex = /^\d{10}$/;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found");
        // Handle the case where the token is missing (e.g., redirect to login)
        return;
      }

      // Validate phone number format
      if (!phoneRegex.test(phoneNo)) {
        setPhoneError("Please enter a valid 10-digit phone number"); // Set error message
        return; // Prevent form submission if phone number is invalid
      }

      // Send form data to your backend API with the token in the headers
      const response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(formData),
      });

      // Check if the request was successful
      if (response.ok) {
        // Handle success response
        console.log("Customer added successfully");
        onClose(); // Close the form modal or navigate to another page
      } else {
        // Handle error response
        const data = await response.json();
        console.error("Failed to add customer:", data.error);
        // You can show an error message to the user or handle the error in another way
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      // Handle any unexpected errors
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Customer
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter customer name"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <select
              id="city"
              name="city"
              value={city}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 appearance-none"
              required
            >
              <option value="">Select city</option>
              {cities.map((cityOption) => (
                <option key={cityOption} value={cityOption}>
                  {cityOption}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNo"
              value={phoneNo}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                phoneError ? "border-red-500" : ""
              }`}
              placeholder="Enter phone number"
              required
            />
            {phoneError && (
              <p className="mt-1 text-sm text-red-500">{phoneError}</p>
            )}
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded"
            >
              Add Customer
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-6 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerForm;
