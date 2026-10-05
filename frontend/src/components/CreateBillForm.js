import React, { useState } from "react";

const CreateBillForm = ({ customer, onClose }) => {
  const [items, setItems] = useState([
    { description: "", quantity: 1, price: 0 },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    calculateTotal();
  };

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const calculateTotal = () => {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    setTotalAmount(total);
    setBalanceAmount(total - amountPaid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${customer._id}/bills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items,
            totalAmount,
            balanceAmount,
            payments: [{ amountPaid }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create bill");
      }

      onClose();
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Create Bill for {customer.name}
      </h2>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Item Description
            </label>
            <input
              type="text"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Quantity
            </label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", Number(e.target.value))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Price
            </label>
            <input
              type="number"
              value={item.price}
              onChange={(e) =>
                handleItemChange(index, "price", Number(e.target.value))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
        >
          Add Item
        </button>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Amount Paid
          </label>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
            onBlur={calculateTotal}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Total Amount: ${totalAmount.toFixed(2)}
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Balance Amount: ${balanceAmount.toFixed(2)}
          </label>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Create Bill
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBillForm;
