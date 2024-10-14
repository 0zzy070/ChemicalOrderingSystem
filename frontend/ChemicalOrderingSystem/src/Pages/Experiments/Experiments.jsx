import React, { useState, useEffect } from "react";
import {
  Modal,
  Toast,
  ToastContainer,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import axios from "axios";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";
import styled from "styled-components";
import IconMdiApplicationEdit from "../../Assets/Icon/IconMdiApplicationEdit.tsx";

const Experiments = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [params, setParams] = useState({
    name: "",
    chemicalId: "",
    amount: "",
    id: null,
  });
  const [experiments, setExperiments] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;

  useEffect(() => {
    document.title = "Experiments";
    fetchExperiments();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopover && !event.target.closest(".popover")) {
        setShowPopover(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showPopover]);

  // Fetch experiments from the API
  const fetchExperiments = async () => {
    try {
      const response = await axios.get("/api/experiments", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setExperiments(response.data.data);
    } catch (error) {
      console.error("Error fetching experiments:", error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setParams({ name: "", chemicalId: "", amount: "", id: null }); // Reset params on close
  };

  // Add or edit an experiment
  const addExperiment = () => {
    setParams({ name: "", chemicalId: "", amount: "", id: null }); // Reset params for new experiment
    handleShow();
  };

  const editExperiment = (experiment) => {
    setParams(experiment);
    handleShow();
  };

  const saveExperiment = async () => {
    try {
      const url = params.id
        ? `/api/experiments/${params.id}`
        : `/api/experiments`;

      const method = params.id ? "patch" : "post"; // Use PUT for updates
      const data = params.id
        ? {
            name: params.name,
            riskAssessment: "hello",
            chemicalId: params.chemicalId,
            amount: Number(params.amount),
            unit: "bucket",
            status: 0,
          }
        : {
            name: params.name,
            //riskAssessment: "hello",
            chemicalId: params.chemicalId,
            amount: Number(params.amount),
            //unit: "bucket",
          };

      await axios({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setToastMessage(
        params.id
          ? "Experiment updated successfully!"
          : "Experiment added successfully!"
      );
      setShowToast(true);
      fetchExperiments();
      handleClose();
    } catch (error) {
      console.error("Error saving experiment:", error);
      setToastMessage("Failed to save the experiment. Please try again.");
      setShowToast(true);
    }
  };

  const deleteExperiment = async (experiment) => {
    try {
      await axios.delete(`/api/experiments/${experiment.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setToastMessage("Experiment deleted successfully!");
      setShowToast(true);
      fetchExperiments();
    } catch (error) {
      console.error("Error deleting experiment:", error);
      setToastMessage("Failed to delete the experiment. Please try again.");
      setShowToast(true);
    }
  };

  const filteredExperiments = experiments.filter((experiment) =>
    experiment.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExperiments.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const StyledPopover = styled(Popover)`
    --bs-popover-max-width: none;
  `;

  const handlePopoverToggle = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to document
    setShowPopover((prev) => !prev); // Toggle popover visibility
  };

  const popover = (
    <StyledPopover id="popover-basic">
      <div className="p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Common Name</th>
              <th>Systematic Name</th>
              <th>Risk Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chemical1</td>
              <td>Chemical1</td>
              <td>High</td>
              <td>3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </StyledPopover>
  );

  return (
    <div className="container-fluid">
      <NavigationBar />
      <div className="row">
        <div className="col-2">
          <SideBar />
        </div>
        <div className="col p-4">
          <div className="d-flex align-items-center justify-content-between mt-4">
            <h2 className="h4 mb-0">Experiments</h2>
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center px-4"
                onClick={addExperiment}
              >
                <IconMdiApplicationEdit className="me-2" />
                New Experiment
              </button>
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search Experiments"
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 top-50 translate-middle-y"
                >
                  <IconSearch />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Experiment Name</th>
                  <th>Chemical ID</th>
                  <th>Supervisor Comment</th>
                  <th>Higher Approver Comment</th>
                  <th>Order Comment</th>
                  <th>Status</th>
                  <th>Disposal Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExperiments
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((experiment) => (
                    <tr key={experiment.id}>
                      <td>{experiment.name}</td>
                      <OverlayTrigger
                        trigger="click"
                        placement="right"
                        overlay={popover}
                        show={showPopover}
                      >
                        <td
                          style={{ color: "#0d6efd" }}
                          onClick={handlePopoverToggle}
                        >
                          {experiment.chemicalId}
                        </td>
                      </OverlayTrigger>
                      <td>{experiment.supervisorComment || "N/A"}</td>
                      <td>{experiment.higherApproveComment || "N/A"}</td>
                      <td>{experiment.orderComment || "N/A"}</td>
                      <td>{experiment.status}</td>
                      <td>{experiment.disposalDate || "N/A"}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center mb-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => editExperiment(experiment)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteExperiment(experiment)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end align-items-center mt-4">
            <span className="me-3">
              {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                filteredExperiments.length
              )} of ${filteredExperiments.length} items`}
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
        </div>
      </div>

      {/* Toast for messages */}
      <ToastContainer position="top-end">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Modal for adding/editing experiments */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {params.id ? "Edit Experiment" : "Add Experiment"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="experimentName" className="form-label">
                Experiment Name
              </label>
              <input
                type="text"
                className="form-control"
                id="experimentName"
                value={params.name}
                onChange={(e) => setParams({ ...params, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="chemicalId" className="form-label">
                Chemical ID
              </label>
              <input
                type="text"
                className="form-control"
                id="chemicalId"
                value={params.chemicalId}
                onChange={(e) =>
                  setParams({ ...params, chemicalId: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                type="text"
                className="form-control"
                id="amount"
                value={params.amount}
                onChange={(e) =>
                  setParams({ ...params, amount: e.target.value })
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={saveExperiment}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Experiments;
