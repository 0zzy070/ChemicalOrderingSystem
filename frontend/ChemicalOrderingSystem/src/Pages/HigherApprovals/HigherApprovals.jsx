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
  const itemsPerPage = 10;
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
  const [loading, setLoading] = useState(false); // 控制加载状态
  const [error, setError] = useState(null); // 错误状态
  // const [comment, setComment] = useState('');

  const data = [
    {
      id: "47b7b712-7a8b-469b-b617-d4ba040be7ac",
      name: "Chemical testing experiment1",
      riskAssessment:
        "The risk assessment for this chemical experiment identifies high potential hazards, including exposure to toxic fumes and fire risks, requiring stringent safety protocols and protective equipment to mitigate potential health and safety impacts.",
      staffSubmitTime: 1723751717601,
      supervisorApproveStatus: null,
      supervisorComment: null,
      supervisorApproveTime: 1723799375387,
      higherApproveStatus: null,
      higherApproveComment: null,
      higherApproveTime: 1723804124915,
      status: 0,
      orderApproveStatus: null,
      orderComment: null,
      orderApproveTime: 1723804135756,
      orderReceiveTime: 1723804160000,
      orderPlacedTime: 1723804190000,
      chemicalId: "6931239f-631e-44ae-bd36-58b7654d52f3",
      amount: 10,
      unit: "bucket          ",
    },
    {
      id: "47b7b712-7a8b-469b-b617-d4ba040be7af",
      name: "Chemical testing experiment2",
      riskAssessment:
        "The risk assessment for this chemical experiment identifies high potential hazards, including exposure to toxic fumes and fire risks, requiring stringent safety protocols and protective equipment to mitigate potential health and safety impacts.",
      staffSubmitTime: 1723751717601,
      supervisorApproveStatus: null,
      supervisorComment: null,
      supervisorApproveTime: 1723799375387,
      higherApproveStatus: null,
      higherApproveComment: null,
      higherApproveTime: 1723804124915,
      status: 0,
      orderApproveStatus: null,
      orderComment: null,
      orderApproveTime: 1723804135756,
      orderReceiveTime: 1723804160000,
      orderPlacedTime: 1723804190000,
      chemicalId: "e5bcefa3-50a8-440e-a4e6-cb5e3de3ef2d",
      amount: 5,
      unit: "bucket          ",
    },
    {
      id: "47b7b712-7a8b-469b-b617-d4ba040be7ag",
      name: "Chemical testing experiment3",
      riskAssessment:
        "The risk assessment for this chemical experiment identifies high potential hazards, including exposure to toxic fumes and fire risks, requiring stringent safety protocols and protective equipment to mitigate potential health and safety impacts.",
      staffSubmitTime: 1723751717601,
      supervisorApproveStatus: false,
      supervisorComment: "Not safe",
      supervisorApproveTime: 1723799375387,
      higherApproveStatus: null,
      higherApproveComment: null,
      higherApproveTime: 1723804124915,
      status: 0,
      orderApproveStatus: null,
      orderComment: null,
      orderApproveTime: 1723804135756,
      orderReceiveTime: 1723804160000,
      orderPlacedTime: 1723804190000,
      chemicalId: "e5bcefa3-50a8-440e-a4e6-cb5e3de3ef2d",
      amount: 10,
      unit: "bucket          ",
    },
    {
      id: "47b7b712-7a8b-469b-b617-d4ba040be7ab",
      name: "Chemical testing experiment4",
      riskAssessment:
        "The risk assessment for this chemical experiment identifies high potential hazards, including exposure to toxic fumes and fire risks, requiring stringent safety protocols and protective equipment to mitigate potential health and safety impacts.",
      staffSubmitTime: 1723751717601,
      supervisorApproveStatus: true,
      supervisorComment: null,
      supervisorApproveTime: 1723799375387,
      higherApproveStatus: true,
      higherApproveComment: null,
      higherApproveTime: 1723804124915,
      status: 5,
      orderApproveStatus: true,
      orderComment: null,
      orderApproveTime: 1723804135756,
      orderReceiveTime: 1723804160000,
      orderPlacedTime: 1723804190000,
      chemicalId: "e5bcefa3-50a8-440e-a4e6-cb5e3de3ef2d",
      amount: 15,
      unit: "bucket          ",
    },
  ];

  useEffect(() => {
    document.title = "Higher Approvals";
    // console.log(requests);
    fetchRequests();
    // console.log("requests", requests);
  }, []);

  // Function to fetch requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/experiments", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the token in the Authorization header
        },
      });
      // console.log("response", response);
      // setRequests(response.data.data);
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // console.log("requests", requests);

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

    // const updatedRequest = {
    //   ...requestToUpdate,
    //   higherApproveComment: comment,
    //   higherApproveStatus: false,
    // };
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

  // Add a new user
  // const addUser = (user) => {
  //   setParams(user);
  //   handleShow();
  // };

  const updateRequest = async (requestToUpdate) => {
    console.log("Updating request status:", requestToUpdate);
    // const updateApiUrl = `http://13.238.27.37:8080/api/experiments/${requestToUpdate.id}`;
    //   const updateResponse = await fetch(updateApiUrl, {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ ...requestToUpdate, status: requestToUpdate.status, supervisorApproveStatus: requestToUpdate.supervisorApproveStatus, supervisorComment: requestToUpdate.supervisorComment}),
    //   });

    //   if (updateResponse.ok) {
    //     console.log('Request status updated successfully.');
    //   } else {
    //     console.error('Failed to update request status.');
    //   }
  };

  const closeApprovalRequest = () => {
    handleClose();
  };
  // const closeDisapprovalRequest=()=>{
  //   handleDisapprovalClose()
  // }

  const totalUsers = requests.filter((user) => {
    const userName = user.userName || "";
    return userName.toLowerCase().includes(search.toLowerCase());
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalUsers.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const ApprovalRequest = async (id) => {
    // setParams(approval);
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
      // console.log('Request status updated:', requests);

      // update request status in the backend
      updateRequest(requestToUpdate);
    } catch (error) {
      console.error(
        "Error fetching chemical data or updating request status:",
        error
      );
    }
  };

  const fetchChemicalData = async (chemicalId) => {
    setLoading(true);
    setError(null);
    try {
      const chemicalApiUrl = `/api/chemicals/${chemicalId}`;
      const response = await axios.get(chemicalApiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the token in the Authorization header
        },
      });
      setChemicalData(response.data.data);
    } catch (error) {
      setError("Failed to load chemical data");
    } finally {
      setLoading(false);
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
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* <td>Chemical1</td>       
              <td>Chemical1</td>
              <td>High</td>
              <td>3</td> */}
            {loading ? (
              <tr>
                <td colSpan="4">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4">{error}</td>
              </tr>
            ) : chemicalData ? (
              <tr>
                <td>{chemicalData.commonName}</td>
                <td>{chemicalData.systematicName}</td>
                <td>{chemicalData.riskCategory}</td>
                <td>{chemicalData.amount}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            )}
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
              {/* <button
                type="button"
                className="btn btn-primary d-flex align-items-center px-4"
                onClick={() => addUser({})}
              >
                <IconUserPlus className="me-2" />
                Add User
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary d-flex align-items-center ${
                  value === "list" && "bg-primary text-white"
                }`}
                onClick={() => setValue("list")}
              >
                <IconListCheck />
              </button> */}
              {/* <button
                type="button"
                className={`btn btn-outline-primary d-flex align-items-center ${
                  value === "grid" && "bg-primary text-white"
                }`}
                onClick={() => setValue("grid")}
              >
                <IconLayoutGrid />
              </button> */}
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search HigherApprovals"
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

          {value === "list" && (
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
                  {console.log("Render requests:", requests)}
                  {/* {totalUsers.map((data) => ( */}
                  {requests.map((request) => (
                    <tr key={request.id}>
                      {/* <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={require("../../Assets/Images/blank-profile.png")}
                            className="rounded-circle me-2"
                            alt="profilepic"
                            style={{ width: "36px", height: "36px" }}
                          />
                        </div>
                      </td> */}
                      <td>{request.name}</td>
                      {/* <OverlayTrigger trigger="click" placement="bottom" overlay={popoverClick}>
                        <td>{request.chemicalId}</td>
                      </OverlayTrigger> */}
                      <OverlayTrigger
                        trigger="click"
                        placement="right"
                        overlay={popover}
                        onEnter={() => fetchChemicalData(request.chemicalId)}
                      >
                        <td style={{ color: "#0d6efd" }}>View</td>
                      </OverlayTrigger>
                      <td>{request.amount}</td>
                      <td>{request.supervisorComment}</td>
                      <td>{request.higherApproveComment}</td>
                      <td>{request.orderComment}</td>
                      <td>{getTableStatus(request)}</td>
                      <td className="text-center ">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => ApprovalRequest(request.id)}
                        >
                          Approval
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDisapprovalShow(request)}
                        >
                          Disapproval
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* {value === "grid" && (
            <div className="row mt-5">
              {totalUsers.map((user) => (
                <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={user.id}>
                  <div className="card text-center shadow">
                    <div className="card-body p-4">
                      <img
                        className="card-img-top rounded-circle mx-auto d-block"
                        src={require("../../Assets/Images/blank-profile.png")}
                        alt="user"
                        style={{ width: "80%", maxHeight: "160px" }}
                      />
                      <h5 className="card-title mt-4">{user.userName}</h5>
                      <p className="card-text">{user.role}</p>
                      <div className="mt-4 text-start">
                        <p>
                          <strong>Employee Number:</strong>{" "}
                          {user.employeeNumber}
                        </p>
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                          <strong>Role:</strong> {user.authority}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => deleteUser(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )} */}

          {/* Pagination */}
          <div className="d-flex justify-content-end align-items-center mt-4">
            <span className="me-3">
              {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                totalUsers.length
              )} of ${totalUsers.length} items`}
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
