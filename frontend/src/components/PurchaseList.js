import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import AddPurchaseForm from "./AddPurchaseForm";
import EditPurchaseForm from "./EditPurchaseForm";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [showAddPurchaseForm, setShowAddPurchaseForm] = useState(false);
  const [showEditPurchaseForm, setShowEditPurchaseForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/purchases", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const handleShowAddPurchaseForm = () => {
    setShowTable(false);
    setShowAddPurchaseForm(true);
  };

  const handleCloseAddPurchaseForm = () => {
    setShowAddPurchaseForm(false);
    setShowTable(true);
    fetchPurchases();
  };

  const handleShowEditPurchaseForm = (purchaseId) => {
    setSelectedPurchaseId(purchaseId);
    setShowTable(false);
    setShowEditPurchaseForm(true);
  };

  const handleCloseEditPurchaseForm = () => {
    setSelectedPurchaseId(null);
    setShowEditPurchaseForm(false);
    setShowTable(true);
    fetchPurchases();
  };

  const handleDeletePurchase = async (purchaseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/purchases/${purchaseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Purchase deleted successfully");
        fetchPurchases(); // Fetch updated purchases list
      } else {
        const data = await response.json();
        console.error("Failed to delete purchase:", data.error);
        // Handle error scenario, show error message to the user
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
      // Handle any unexpected errors
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const offset = currentPage * rowsPerPage;
  const currentPurchases = purchases.slice(offset, offset + rowsPerPage);

  return (
    <div className="p-4">
      {showTable && (
        <div className="flex flex-col items-center w-full overflow-x-auto">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                All Purchases
              </h2>
              <button
                onClick={handleShowAddPurchaseForm}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Add New Purchase
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
                {currentPurchases.map((purchase, index) => (
                  <tr
                    key={purchase._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(purchase.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex space-x-2">
                      <button
                        onClick={() => handleShowEditPurchaseForm(purchase._id)}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePurchase(purchase._id)}
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
                {Math.min((currentPage + 1) * rowsPerPage, purchases.length)} of{" "}
                {purchases.length}
              </span>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(purchases.length / rowsPerPage)}
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
      {showAddPurchaseForm && (
        <AddPurchaseForm onClose={handleCloseAddPurchaseForm} />
      )}
      {showEditPurchaseForm && (
        <EditPurchaseForm
          purchaseId={selectedPurchaseId}
          onClose={handleCloseEditPurchaseForm}
        />
      )}
    </div>
  );
};

export default PurchaseList;
