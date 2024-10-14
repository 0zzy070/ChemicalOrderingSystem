import { React, useState, useEffect } from "react";
import {
  Modal,
  Toast,
  ToastContainer,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import axios from "axios";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";
import styled from "styled-components";

const HigherApprovals = () => {
  const [value, setValue] = useState("list");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [params, setParams] = useState({
    name: "",
    email: "",
    role: "",
    id: null,
  });
  const [requests, setRequests] = useState([]); // State to hold requests data
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;
  const [showDisapprovalModal, setShowDisapprovalModal] = useState(false);
  const [ShowSupervisorModal, setShowSupervisorModal] = useState(false);
  const [requestToUpdate, setRequestToUpdate] = useState(null);
  const [chemicalData, setChemicalData] = useState(null); // 存储化学品数据
  const [activeChemicalId, setActiveChemicalId] = useState(null); // State to track active chemical ID
  const [loading, setLoading] = useState(false); // 控制加载状态
  const [error, setError] = useState(null); // 错误状态
  // const [comment, setComment] = useState('');

  useEffect(() => {
    document.title = "Higher Approvals";
    fetchRequests();
  }, []);

  // Function to fetch requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/experiments", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the token in the Authorization header
        },
      });
      const filteredRequests = response.data.data.filter(
        (request) => request.status === 1
      );
      setRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSupervisorShow = () => setShowSupervisorModal(true);
  const handleSupervisorClose = () => setShowSupervisorModal(false);

  const handleDisapprovalShow = (request) => {
    setRequestToUpdate(request);
    setShowDisapprovalModal(true);
    console.log("open one request", request);
  };
  const handleDisapprovalClose = () => {
    setShowDisapprovalModal(false);
    setRequestToUpdate(null);
  };

  const handleDisapprovalSubmit = async (event) => {
    event.preventDefault();
    const comment = document.getElementById("comment").value || "";
    console.log("submit comment:", comment);
    const updatedRequest = JSON.parse(
      JSON.stringify({
        ...requestToUpdate,
        higherApproveComment: comment,
        higherApproveStatus: false,
        status: 1,
      })
    );

    try {
      await updateRequest(updatedRequest);
      // setRequests((prevRequests) =>
      //   prevRequests.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
      // );
      setRequests((prevRequests) =>
        prevRequests.map((req) => {
          if (req.id === updatedRequest.id) {
            console.log("Updated request inside setRequests:", updatedRequest);
            return updatedRequest;
          }
          return req;
        })
      );
      console.log("Request disapproved:", requests);
      handleDisapprovalClose();
    } catch (error) {
      console.error("Error processing the request:", error);
    }
  };

  const updateRequest = async (requestToUpdate) => {
    console.log("Updating request status:", requestToUpdate);
    const updateApiUrl = `http://13.238.27.37:8080/api/experiments/${requestToUpdate.id}`;
    const updateResponse = await fetch(updateApiUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...requestToUpdate,
        status: requestToUpdate.status,
        supervisorApproveStatus: requestToUpdate.supervisorApproveStatus,
        supervisorComment: requestToUpdate.supervisorComment,
      }),
    });

    if (updateResponse.ok) {
      console.log("Request status updated successfully.");
    } else {
      console.error("Failed to update request status.");
    }
  };

  const closeApprovalRequest = () => {
    handleClose();
  };

  const totalApprovals = requests.filter((experiment) => {
    const name = experiment.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalApprovals.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const ApprovalRequest = async (id) => {
    try {
      const requestToUpdate = requests.find((req) => req.id === id);

      if (!requestToUpdate) {
        console.error("Request not found");
        return;
      }

      requestToUpdate.status = 2;
      requestToUpdate.higherApproveStatus = true;

      const updatedRequests = requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: requestToUpdate.status,
              higherApproveStatus: requestToUpdate.higherApproveStatus,
            }
          : req
      );

      setRequests(updatedRequests);
      handleSupervisorShow();
      updateRequest(requestToUpdate);
    } catch (error) {
      console.error(
        "Error fetching chemical data or updating request status:",
        error
      );
    }
  };

  const handlePopoverToggle = async (chemicalId) => {
    if (activeChemicalId === chemicalId) {
      setActiveChemicalId(null);
    } else {
      try {
        const response = await axios.get("/api/chemicals", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const chemicalsList = response.data.data;

        const selectedChemical = chemicalsList.find(
          (chemical) => chemical.id === chemicalId
        );

        setChemicalData(selectedChemical || null);
      } catch (error) {
        console.error("Error fetching chemicals:", error);
      }
      setActiveChemicalId(chemicalId); // Set the clicked chemicalId
    }
  };

  const StyledPopover = styled(Popover)`
    --bs-popover-max-width: none;
  `;

  const popover = (
    <StyledPopover id="popover-basic">
      {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
      <div className="p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Common Name</th>
              <th>Systematic Name</th>
              <th>Risk Category</th>
            </tr>
          </thead>
          <tbody>
            <td>{chemicalData?.commonName || "N/A"}</td>
            <td>{chemicalData?.systematicName || "N/A"}</td>
            <td>
              {chemicalData?.riskCategory === 0
                ? "Low"
                : chemicalData?.riskCategory === 1
                ? "Medium"
                : chemicalData?.riskCategory === 2
                ? "High"
                : "N/A"}
            </td>
          </tbody>
        </table>
      </div>
    </StyledPopover>
  );

  const getTableStatus = (data) => {
    // Check supervisor approval status
    if (data.status === 0) {
      if (data.supervisorApproveStatus === null) {
        return "processing";
      }
      if (data.supervisorApproveStatus === false) {
        return "supervisor disapprove";
      }
      if (data.supervisorApproveStatus === true) {
        return "supervisor approve";
      }
    }

    // Check higher approver status
    if (data.status === 1) {
      if (data.higherApproveStatus === null) {
        return "processing(higher approver)";
      }
      if (data.higherApproveStatus === false) {
        return "higher approver disapprove";
      }
      if (data.higherApproveStatus === true) {
        return "higher approver approve";
      }
    }

    // Check order manager status
    if (data.status === 2) {
      if (data.orderApproveStatus === null) {
        return "processing(order)";
      }
      if (data.orderApproveStatus === false) {
        return "order manager disapprove";
      }
      if (data.orderApproveStatus === true) {
        return "order manager approve";
      }
    }

    // Check order manager ordered, received, and placed
    if (data.status === 3) {
      return "order manager ordered";
    }
    if (data.status === 4) {
      return "order manager received";
    }
    if (data.status === 5) {
      return "order manager placed";
    }

    return "Unknown status"; // Fallback case if nothing matches
  };
  // const handleCommentChange = (event) => {
  //   setComment(event.target.value);
  //   console.log('comment:', event.target.value);
  // };

  return (
    <div className="container-fluid">
      <NavigationBar />
      <div className="row">
        <div className="col-2">
          <SideBar />
        </div>
        <div className="col p-4">
          <div className="d-flex align-items-center justify-content-between mt-4">
            <div className="d-flex align-items-center gap-3">
              <h2 className="h4 mb-0">Higher Approvals</h2>
            </div>
            <div className="d-flex gap-3">
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search HigherApprovals"
                  style={{ width: "400px" }}
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
                  {/* <th>Image</th> */}
                  <th>Experiment Name</th>
                  <th>Chemical</th>
                  <th>Chemical Amount</th>
                  <th>Supervisor Comment</th>
                  <th>Higher approver Comment</th>
                  <th>Order Comment</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {totalApprovals.map((request) => (
                  <tr key={request.id}>
                    <td>{request.name}</td>
                    <OverlayTrigger
                      trigger="click"
                      placement="right"
                      overlay={popover}
                      show={activeChemicalId === request.chemicalId} //
                    >
                      <td
                        style={{ color: "#0d6efd" }}
                        onClick={() => handlePopoverToggle(request.chemicalId)}
                      >
                        View
                      </td>
                    </OverlayTrigger>
                    <td>{request.amount}</td>
                    <td>{request.supervisorComment}</td>
                    <td>{request.higherApproveComment}</td>
                    <td>{request.orderComment}</td>
                    <td>{getTableStatus(request)}</td>
                    <td className="text-center ">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary btn-custom"
                        style={{ width: "100px", margin: "2px 0" }}
                        onClick={() => ApprovalRequest(request.id)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger btn-custom"
                        style={{ width: "100px", margin: "2px 0" }}
                        onClick={() => handleDisapprovalShow(request)}
                      >
                        Reject
                      </button>
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
                totalApprovals.length
              )} of ${totalApprovals.length} items`}
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

          {/* Modal for Approval */}
          <Modal show={ShowSupervisorModal} onHide={handleSupervisorClose}>
            <Modal.Header closeButton>
              <Modal.Title>{"Approval Windows"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  {/* <label htmlFor="userName" className="form-label">
                    Comment:
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="username"
                    value={params.userName || ""}
                    style={{ height: "200px" }}
                    onChange={(e) =>
                      setParams({ ...params, userName: e.target.value })
                    }
                  /> */}
                  Approval successfully!
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <div class="d-grid gap-2 col-6 mx-auto">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSupervisorClose}
                >
                  {/* {params.id ? "Save Changes" : "Add User"} */}
                  OK
                </button>
              </div>
            </Modal.Footer>
          </Modal>

          {/* Modal for Higher Approval */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{"Approval Windows"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  {/* <label htmlFor="userName" className="form-label">
                    Comment:
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="username"
                    value={params.userName || ""}
                    style={{ height: "200px" }}
                    onChange={(e) =>
                      setParams({ ...params, userName: e.target.value })
                    }
                  /> */}
                  This experiment is classified as high-risk and it will
                  automatically be sent for review by individuals with higher
                  authority.
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <div class="d-grid gap-2 col-6 mx-auto">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closeApprovalRequest}
                >
                  {/* {params.id ? "Save Changes" : "Add User"} */}
                  OK
                </button>
              </div>
            </Modal.Footer>
          </Modal>

          {/* Modal for Disapproval */}
          <Modal show={showDisapprovalModal} onHide={handleDisapprovalClose}>
            <Modal.Header closeButton>
              <Modal.Title>{"Disapproval Comment"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleDisapprovalSubmit}>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">
                    Comment:
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="comment"
                    style={{ height: "200px" }}
                    // value={comment}
                    // onChange={handleCommentChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary "
                  // onClick={closeDisapprovalRequest}
                  id="disapproval-submit"
                >
                  {/* {params.id ? "Save Changes" : "Add User"} */}
                  Submit
                </button>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default HigherApprovals;
