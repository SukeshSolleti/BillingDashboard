import React, { useState, useEffect, useCallback } from "react";

const EditExpenseForm = ({ expenseId, onClose, fetchExpenses }) => {
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    date: "", // Ensure date is initialized as an empty string
  });

  const fetchExpense = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/expenses/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const { description, price, date } = data;

      // Ensure date is formatted as YYYY-MM-DD for input type="date"
      const formattedDate = new Date(date).toISOString().split("T")[0];

      setFormData({ description, price, date: formattedDate });
    } catch (error) {
      console.error("Error fetching expense:", error);
    }
  }, [expenseId]);

  useEffect(() => {
    if (expenseId) {
      fetchExpense();
    }
  }, [expenseId, fetchExpense]); // Include fetchExpense in the dependency array

  const { description, price, date } = formData;

  const descriptions = [
    "Transport",
    "Electricity Bill",
    "Petrol",
    "Spare Parts",
    "Labour",
    "Rent",
    "Tea",
  ]; // Example descriptions, you can add more

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/expenses/${expenseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        console.log("Expense updated successfully");
        onClose(); // Close the form modal or navigate to another page
        fetchExpenses(); // Fetch updated expenses list
      } else {
        const data = await response.json();
        console.error("Failed to update expense:", data.error);
        // Handle error scenario, show error message to the user
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      // Handle any unexpected errors
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <select
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 appearance-none"
              required
            >
              <option value="">Select description</option>
              {descriptions.map((desc) => (
                <option key={desc} value={desc}>
                  {desc}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded"
            >
              Update Expense
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

export default EditExpenseForm;
