import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import AddExpenseForm from "./AddExpenseForm";
import { FaTrashAlt, FaEdit } from "react-icons/fa"; // Import edit icon
import EditExpenseForm from "./EditExpenseForm";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [showEditExpenseForm, setShowEditExpenseForm] = useState(false); // State for edit form
  const [currentExpenseId, setCurrentExpenseId] = useState(null); // State to track current expense ID for editing
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleShowAddExpenseForm = () => {
    setShowTable(false);
    setShowAddExpenseForm(true);
  };

  const handleCloseAddExpenseForm = () => {
    setShowAddExpenseForm(false);
    setShowTable(true);
    fetchExpenses();
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/expenses/${expenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Expense deleted successfully");
        fetchExpenses();
      } else {
        console.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEditExpense = (expenseId) => {
    setCurrentExpenseId(expenseId);
    setShowTable(false);
    setShowEditExpenseForm(true);
  };

  const handleCloseEditExpenseForm = () => {
    setShowEditExpenseForm(false);
    setShowTable(true);
    setCurrentExpenseId(null);
    fetchExpenses();
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const offset = currentPage * rowsPerPage;
  const currentExpenses = expenses.slice(offset, offset + rowsPerPage);

  return (
    <div className="p-4">
      {showTable && (
        <div className="flex flex-col items-center w-full overflow-x-auto">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">All Expenses</h2>
              <button
                onClick={handleShowAddExpenseForm}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Add New Expense
              </button>
            </div>
            <table className="w-full table-auto divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentExpenses.map((expense, index) => (
                  <tr
                    key={expense._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex space-x-2">
                      <button
                        onClick={() => handleEditExpense(expense._id)}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Rows per page:
                </label>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {currentPage * rowsPerPage + 1}-
                {Math.min((currentPage + 1) * rowsPerPage, expenses.length)} of{" "}
                {expenses.length}
              </span>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(expenses.length / rowsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex items-center space-x-2"}
                subContainerClassName={
                  "pages pagination flex items-center space-x-2"
                }
                activeClassName={"active"}
                pageClassName={
                  "bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded transition duration-300 ease-in-out"
                }
                activeLinkClassName={"bg-green-500 text-white border-green-500"}
                previousLinkClassName={
                  "bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded transition duration-300 ease-in"
                }
                nextLinkClassName={
                  "bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded transition duration-300 ease-in"
                }
              />
            </div>
          </div>
        </div>
      )}
      {showAddExpenseForm && (
        <AddExpenseForm onClose={handleCloseAddExpenseForm} />
      )}
      {showEditExpenseForm && (
        <EditExpenseForm
          expenseId={currentExpenseId}
          onClose={handleCloseEditExpenseForm}
          fetchExpenses={fetchExpenses}
        />
      )}
    </div>
  );
};

export default ExpenseList;
