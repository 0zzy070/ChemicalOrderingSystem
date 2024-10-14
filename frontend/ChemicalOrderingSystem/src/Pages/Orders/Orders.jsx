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

const Orders = () => {
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
  const [users, setUsers] = useState([]); // State to hold users data
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;
  const [showDisapprovalModal, setShowDisapprovalModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  useEffect(() => {
    document.title = "Orders";
    // console.log(users);
    // fetchUsers();
    // console.log("users", users);
  }, []);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the token in the Authorization header
        },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDisapprovalShow = () => setShowDisapprovalModal(true);
  const handleDisapprovalClose = () => setShowDisapprovalModal(false);
  const handleDateShow = () => setShowDateModal(true);
  const handleDateClose = () => setShowDateModal(false);

  const deleteUser = async (user) => {
    try {
      // Construct the API URL with the user ID
      const url = `api/users/${user.id}`;

      // Make the DELETE request with the access token
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Optionally, update the UI or state after successful deletion
      console.log("User deleted successfully");
      setToastMessage("User deleted successfully!");
      setShowToast(true); // Show the toast notification

      // Refresh the user list or update the state
      fetchUsers(); // Fetch the latest user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const totalUsers = users.filter((user) => {
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
  const data = [];

  const ApprovalRequest = () => {
    // setParams(approval);
    handleShow();
  };

  const DisapprovalRequest = () => {
    // setParams(approval);
    handleDisapprovalShow();
  };
  const closeApprovalRequest = () => {
    handleClose();
  };
  const closeDisapprovalRequest = () => {
    handleDisapprovalClose();
  };

  const SelectDate = () => {
    handleDateShow();
  };
  const closeSelectDate = () => {
    handleDateClose();
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
            <td>Chemical1</td>
            <td>Chemical1</td>
            <td>High</td>
            <td>3</td>
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
            <div className="d-flex align-items-center gap-3">
              <h2 className="h4 mb-0">Orders</h2>
            </div>
            <div className="d-flex gap-3">
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search Orders"
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
                    <th>Chemical ID</th>
                    <th>Supervisor Comment</th>
                    <th>Higher approver Comment</th>
                    <th>Order Comment</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {totalUsers.map((data) => ( */}
                  {data.map((request) => (
                    <tr key={request.id}>
                      <td>{request.name}</td>

                      <OverlayTrigger
                        trigger="click"
                        placement="right"
                        overlay={popover}
                      >
                        <td style={{ color: "#0d6efd" }}>
                          {request.chemicalId}
                        </td>
                      </OverlayTrigger>

                      <td>{request.supervisorComment}</td>
                      <td>{request.higherApproveComment}</td>
                      <td>{request.orderComment}</td>
                      <td>status</td>
                      <td className="text-center ">
                        <div className="d-flex justify-content-center mb-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => ApprovalRequest()}
                          >
                            Approved
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => DisapprovalRequest()}
                          >
                            Rejected
                          </button>
                        </div>
                        <div className="d-flex justify-content-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => SelectDate()}
                          >
                            Disposal Date
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{"Approval Windows"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="commonName" className="form-label">
                    Storage Location:
                  </label>
                  <select
                    name="location"
                    id="location"
                    className="form-control"
                  >
                    <option value="location1">Location1</option>
                    <option value="location2">Location2</option>
                    <option value="location3">Location3</option>
                  </select>
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
                  Approval
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
              <form>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">
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
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-primary"
                onClick={closeDisapprovalRequest}
              >
                {/* {params.id ? "Save Changes" : "Add User"} */}
                Disapprove
              </button>
            </Modal.Footer>
          </Modal>

          {/* Modal for Disposal Date */}
          <Modal show={showDateModal} onHide={handleDateClose}>
            <Modal.Header closeButton>
              <Modal.Title>{"Disposal Date"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="commonName" className="form-label">
                    Select Disposal Date:
                  </label>
                  <input
                    id="disposalDate"
                    type="date"
                    className="form-control"
                    // value={params.commonName}
                    onChange={(e) =>
                      setParams({ ...params, commonName: e.target.value })
                    }
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <div class="d-grid gap-2 col-6 mx-auto">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closeSelectDate}
                >
                  {/* {params.id ? "Save Changes" : "Add User"} */}
                  Submit
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Orders;
