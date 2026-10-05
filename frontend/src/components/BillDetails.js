import React, { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";

const BillDetails = ({ customer, onClose }) => {
  const [bills, setBills] = useState([]);
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedBillId, setSelectedBillId] = useState(null); // State to store selected bill ID
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const fetchBills = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/customers/${customer._id}/bills`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  }, [customer]); // useCallback with customer as a dependency

  useEffect(() => {
    fetchBills();
  }, [fetchBills]); // useEffect dependency on fetchBills

  const handleMakePayment = async (billId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/customers/${customer._id}/bills/${billId}/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amountPaid: paymentAmount }),
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        fetchBills(); // Refresh bills after successful payment
        setIsPaymentPopupOpen(false); // Close the payment popup
        setPaymentAmount(0); // Reset payment amount
      } else {
        console.error("Failed to make payment:", responseData.error);
        // Handle specific error messages or feedback to the user
      }
    } catch (error) {
      console.error("Error making payment:", error);
      // Handle generic error messages or display a fallback error message
    }
  };

  const openPaymentPopup = (billId) => {
    setSelectedBillId(billId); // Set selectedBillId to the clicked bill's ID
    setIsPaymentPopupOpen(true);
    // Optionally, you can also pre-fill payment amount based on bill details
    // For example, if billId is provided and bills are stored in a way to access amount due.
    // const bill = bills.find(bill => bill._id === billId);
    // setPaymentAmount(bill.balanceAmount);
  };

  const closePaymentPopup = () => {
    setIsPaymentPopupOpen(false);
    setPaymentAmount(0); // Reset payment amount on close
    setSelectedBillId(null); // Reset selectedBillId
  };

  // Pagination handlers
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  //   const handleRowsPerPageChange = (e) => {
  //     setRowsPerPage(Number(e.target.value));
  //     setCurrentPage(0);
  //   };

  const offset = currentPage * rowsPerPage;
  const currentBills = bills.slice(offset, offset + rowsPerPage);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Bills for {customer.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200 mb-4">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Balance Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentBills.map((bill) => (
                <tr key={bill._id} className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bill.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.items.map((item) => (
                      <div key={item._id}>{item.description}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.items.map((item) => (
                      <div key={item._id}>{item.quantity}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.items.map((item) => (
                      <div key={item._id}>${item.price.toFixed(2)}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${bill.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${bill.balanceAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.payments.map((payment) => (
                      <div key={payment._id}>
                        ${payment.amountPaid.toFixed(2)}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <button
                      onClick={() => openPaymentPopup(bill._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mr-2"
                    >
                      Make Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* <label className="text-sm font-medium text-gray-700">
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
              </select> */}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentPage * rowsPerPage + 1}-
              {Math.min((currentPage + 1) * rowsPerPage, bills.length)} of{" "}
              {bills.length}
            </span>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={Math.ceil(bills.length / rowsPerPage)}
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

      {isPaymentPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Make Payment</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={closePaymentPopup}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMakePayment(selectedBillId)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetails;
