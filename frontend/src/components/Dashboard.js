import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import AddCustomerForm from "./AddCustomerForm";
import CustomerList from "./CustomerList";
import ExpenseList from "./ExpenseList";
import PurchaseList from "./PurchaseList";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [activeView, setActiveView] = useState("dashboard"); // State to track active view
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        await userService.verifyToken(token);
      } catch (error) {
        console.error("Token verification failed", error);
        navigate("/login");
      }
    };

    verifyUserToken();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddCustomer = () => {
    setIsDropdownOpen(false);
    setShowAddCustomerForm(true);
  };

  const handleCloseAddCustomerForm = () => {
    setShowAddCustomerForm(false);
  };

  const handleMenuItemClick = (menu) => {
    setActiveView(menu.toLowerCase());
    setIsSidebarOpen(false); // Close sidebar on menu item click
    setShowAddCustomerForm(false); // Close add customer form on menu item click
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <div>Dashboard Content</div>;
      case "stock":
        return <div>Stock Content</div>;
      case "orders":
        return <div>Orders Content</div>;
      case "customers":
        return <CustomerList />;
      case "expenses":
        return <ExpenseList />;
      case "purchases":
        return <PurchaseList />;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 flex-shrink-0 fixed h-full transition-all duration-300 z-50 ${
          isSidebarOpen ? "opacity-100 left-0" : "opacity-0 -left-64"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl font-bold">R.K Paper Plate Industries</h2>
          <button
            className="text-gray-400 hover:text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isSidebarOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 10h16M4 14h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
        <ul className="mt-4">
          <li
            className="p-4 hover:bg-gray-800 cursor-pointer"
            onClick={() => handleMenuItemClick("Dashboard")}
          >
            Dashboard
          </li>
          <li
            className="p-4 hover:bg-gray-800 cursor-pointer"
            onClick={() => handleMenuItemClick("Stock")}
          >
            Stock
          </li>
          <li
            className="p-4 hover:bg-gray-800 cursor-pointer"
            onClick={() => handleMenuItemClick("Orders")}
          >
            Orders
          </li>
          <li
            className="p-4 hover:bg-gray-800 cursor-pointer"
            onClick={() => handleMenuItemClick("Customers")}
          >
            Customers
          </li>
          <li
            className="p-4 hover:bg-gray-800 cursor-pointer"
            onClick={() => handleMenuItemClick("Expenses")}
          >
            Expenses
          </li>
          <li
            className="p-4 hover:bg-gray-800 cursor-pointer"
            onClick={() => handleMenuItemClick("Purchases")}
          >
            Purchases
          </li>
        </ul>
      </div>
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between">
          <button
            className="text-gray-800 focus:outline-none"
            onClick={toggleSidebar}
          >
            <FaBars size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome to R.K Paper Plate Industries Dashboard
          </h1>
          <div className="relative">
            <button
              className="text-gray-800 focus:outline-none"
              onClick={toggleDropdown}
            >
              <FaUserCircle size={24} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-lg py-2">
                <button className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left">
                  Profile
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
                  onClick={handleAddCustomer}
                >
                  Add Customer
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {showAddCustomerForm && (
            <AddCustomerForm onClose={handleCloseAddCustomerForm} />
          )}
          {!showAddCustomerForm && renderActiveView()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 mt-auto shadow-sm flex justify-center">
          <p className="text-gray-600 text-sm">
            &copy; 2024 R.K Paper Plate Industries. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
