import { useState, useEffect } from "react";
import { Modal, Toast, ToastContainer } from "react-bootstrap";
import React from "react";
import IconFlask from "../../Assets/Icon/IconChemicalFlaskPlus.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";
import defaultChemicalImg from "../../Assets/Images/default-chemical.jpg";
import axios from "axios";

const Chemicals = () => {
  const [search, setSearch] = useState("");
  const [chemicals, setChemicals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 4; // Show 4 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState({
    commonName: "",
    systematicName: "",
    riskCategory: null,
    storagePeriod: null,
    id: null,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;

  useEffect(() => {
    document.title = "Chemicals";
    fetchChemicals(); // Fetch chemicals when the component mounts
  }, []);

  // Function to fetch chemicals
  const fetchChemicals = async () => {
    try {
      const response = await axios.get("/api/chemicals", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the token in the Authorization header
        },
      });
      setChemicals(response.data.data);
    } catch (error) {
      console.error("Error fetching chemicals:", error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const addChemical = (chemical) => {
    setParams(chemical);
    handleShow();
  };

  const saveChemical = async () => {
    try {
      let url = "/api/chemicals";
      let method = "post";

      if (params.id) {
        url = `/api/chemicals/${params.id}`;
        method = "patch";
      }

      await axios({
        method: method,
        url: url,
        data: params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setToastMessage(
        params.id
          ? "Chemical updated successfully!"
          : "Chemical added successfully!"
      );
      setShowToast(true);
      fetchChemicals(); // Fetch the latest chemical list
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const editChemical = (chemical) => {
    setParams(chemical);
    handleShow();
  };

  const deleteChemical = async (chemical) => {
    try {
      const url = `api/chemicals/${chemical.id}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setToastMessage("Chemical deleted successfully!");
      setShowToast(true);
      fetchChemicals(); // Fetch the latest Chemical list
    } catch (error) {
      console.error("Error deleting Chemical:", error);
    }
  };

  // Filter and paginate chemicals based on the search term
  const totalChemicals = chemicals.filter((chemical) => {
    const chemicalName = chemical.commonName || "";
    return chemicalName.toLowerCase().includes(search.toLowerCase());
  });

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChemicals = totalChemicals.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(totalChemicals.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const searchChemical = () => {
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="container-fluid">
      <NavigationBar></NavigationBar>
      <div className="row">
        <div className="col-2">
          <SideBar></SideBar>
        </div>
        <div className="col p-4">
          <div className="d-flex align-items-center justify-content-between mt-4">
            <div className="d-flex align-items-center gap-3">
              <h2 className="h4 mb-0">Chemicals</h2>
            </div>
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center px-4"
                onClick={() => addChemical({})}
              >
                <IconFlask className="me-2" />
                Add a Chemical
              </button>
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search Chemicals"
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 top-50 translate-middle-y"
                  onClick={searchChemical}
                >
                  <IconSearch />
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            {paginatedChemicals.map((chemical) => (
              <div
                className="col-xl-3 col-lg-4 col-md-6 mb-4"
                key={chemical.id}
              >
                <div className="card text-center shadow h-100">
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <img
                      className="card-img-top rounded-circle mx-auto d-block"
                      src={defaultChemicalImg}
                      alt="chemical"
                      style={{ width: "70%", height: "150px" }}
                    />
                    <h5 className="card-title mt-4">{chemical.commonName}</h5>
                    <div className="mt-4 text-start">
                      <p>
                        <strong>Systematic Name:</strong>{" "}
                        {chemical.systematicName}
                      </p>
                      <p>
                        <strong>Risk Category:</strong>{" "}
                        {chemical.riskCategory === 0
                          ? "Low"
                          : chemical.riskCategory === 1
                          ? "Medium"
                          : chemical.riskCategory === 2
                          ? "High"
                          : chemical.riskCategory}
                      </p>
                      <p>
                        <strong>Storage Period:</strong>{" "}
                        {chemical.storagePeriod}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => editChemical(chemical)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => deleteChemical(chemical)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end align-items-center mt-4">
            <span className="me-3">
              {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                totalChemicals.length
              )} of ${totalChemicals.length} items`}
            </span>
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &larr; {/* Left arrow */}
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &rarr; {/* Right arrow */}
            </button>
          </div>

          {/* Toast Message for Adding & Deleting User */}
          <ToastContainer position="top-end" className="p-3">
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              autohide
            >
              <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
          </ToastContainer>

          {/* Modal for Add/Edit */}
          <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {params.id ? "Edit Chemical" : "Add a New Chemical"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="commonName" className="form-label">
                    Common Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="commonName"
                    value={params.commonName}
                    onChange={(e) =>
                      setParams({ ...params, commonName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="systematicName" className="form-label">
                    Systematic Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="systematicName"
                    value={params.systematicName}
                    onChange={(e) =>
                      setParams({ ...params, systematicName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="riskCategory" className="form-label">
                    Risk Category
                  </label>
                  <select
                    id="riskCategory"
                    className="form-select"
                    value={params.riskCategory || ""}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        riskCategory: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    <option value={0}>Low</option>
                    <option value={1}>Medium</option>
                    <option value={2}>High</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="storagePeriod" className="form-label">
                    Storage Period
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="storagePeriod"
                    value={params.storagePeriod}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        storagePeriod: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveChemical}
              >
                {params.id ? "Update Chemical" : "Save Chemical"}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Chemicals;
