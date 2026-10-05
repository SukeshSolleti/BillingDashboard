import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import AddCustomerForm from "./AddCustomerForm";
import CreateBillForm from "./CreateBillForm";
import BillDetails from "./BillDetails"; // Import the BillDetails component
import { FaTrashAlt } from "react-icons/fa";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [showCreateBillForm, setShowCreateBillForm] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false); // State to manage visibility of the Bill Details
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleShowAddCustomerForm = () => {
    setShowTable(false);
    setShowAddCustomerForm(true);
  };

  const handleCloseAddCustomerForm = () => {
    setShowAddCustomerForm(false);
    setShowTable(true);
    fetchCustomers();
  };

  const handleShowCreateBillForm = (customer) => {
    setSelectedCustomer(customer);
    setShowTable(false);
    setShowCreateBillForm(true);
  };

  const handleCloseCreateBillForm = () => {
    setShowCreateBillForm(false);
    setShowTable(true);
    fetchCustomers();
  };

  const handleShowBillDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowTable(false);
    setShowBillDetails(true);
  };

  const handleCloseBillDetails = () => {
    setShowBillDetails(false);
    setShowTable(true);
    fetchCustomers();
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/customers/${customerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Customer deleted successfully");
        fetchCustomers();
      } else {
        console.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const offset = currentPage * rowsPerPage;
  const currentCustomers = customers.slice(offset, offset + rowsPerPage);

  return (
    <div className="p-4">
      {showTable && (
        <div className="flex flex-col items-center w-full overflow-x-auto">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                All Customers
              </h2>
              <button
                onClick={handleShowAddCustomerForm}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Add New Customer
              </button>
            </div>
            <table className="w-full table-auto divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    City
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Phone Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Total Transaction Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Total Due Amount
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
                {currentCustomers.map((customer, index) => (
                  <tr
                    key={customer._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.phoneNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.totalTransactionAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.totalDueAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button
                        onClick={() => handleShowCreateBillForm(customer)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mr-2"
                      >
                        Create Bill
                      </button>
                      <button
                        onClick={() => handleShowBillDetails(customer)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        View Bills
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ml-2"
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
                {Math.min((currentPage + 1) * rowsPerPage, customers.length)} of{" "}
                {customers.length}
              </span>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(customers.length / rowsPerPage)}
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

      {showAddCustomerForm && (
        <AddCustomerForm onClose={handleCloseAddCustomerForm} />
      )}

      {showCreateBillForm && (
        <CreateBillForm
          customer={selectedCustomer}
          onClose={handleCloseCreateBillForm}
        />
      )}

      {showBillDetails && (
        <BillDetails
          customer={selectedCustomer}
          onClose={handleCloseBillDetails}
        />
      )}
    </div>
  );
};

export default CustomerList;
