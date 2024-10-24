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
  const [showToast, setShowToast] = useState(false);
  const [orders, setOrders] = useState([]); // State to hold orders data
  const [toastMessage, setToastMessage] = useState("");
  const [activeChemicalId, setActiveChemicalId] = useState(null);
  const [chemicalData, setChemicalData] = useState(null);
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;
  const [showDisapprovalModal, setShowDisapprovalModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(""); // Add this line to define selectedLocationId state
  const [orderToUpdate, setOrderToUpdate] = useState(null); // Add this line to define orderToUpdate state

  useEffect(() => {
    document.title = "Orders";
    fetchOrders();
  }, []);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/experiments", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the token in the Authorization header
        },
      });
      const filteredRequests = response.data.data.filter(
        (request) => request.status === 2
      );
      setOrders(filteredRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const ApprovalRequestFetch = async () => {
    try {
      const response = await axios.get(
        `/api/organizational-units/listByOrgType/2`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data.data;
      if (Array.isArray(data)) {
        setLocations(data);
      } else {
        console.error("Expected an array but received:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => setShowModal(false);

  const handleApprovalShow = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
    ApprovalRequestFetch();
  };

  const handleApprovalClose = () => {
    setShowModal(false);
    setSelectedOrderId(null);
    setSelectedLocationId(""); // Clear selected location ID on modal close
  };

  const confirmApproval = () => {
    if (selectedOrderId) {
      ApprovalRequest(selectedOrderId, selectedLocationId); // Pass selected location ID to API call
    }
    setShowModal(false);
  };

  const handleDisapprovalShow = (order) => {
    setShowDisapprovalModal(true);
    setOrderToUpdate(order);
  };
  const handleDisapprovalClose = () => {
    setShowDisapprovalModal(false);
    setOrderToUpdate(null);
  };
  const handleDateShow = () => setShowDateModal(true);
  const handleDateClose = () => setShowDateModal(false);

  const deleteOrder = async (order) => {
    try {
      // Construct the API URL with the order ID
      const url = `api/orders/${order.id}`;

      // Make the DELETE request with the access token
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Optionally, update the UI or state after successful deletion
      console.log("order deleted successfully");
      setToastMessage("order deleted successfully!");
      setShowToast(true); // Show the toast notification

      // Refresh the order list or update the state
      fetchOrders(); // Fetch the latest order list
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleDisapprovalSubmit = async (event) => {
    event.preventDefault();
    const comment = document.getElementById("comment").value || "";
    console.log("submit comment:", comment);
    if (!orderToUpdate) {
      console.error("No order to update.");
      return;
    }
    const updatedOrder = {
      ...orderToUpdate,
      orderApproveComment: comment,
      orderApproveStatus: false,
      status: 1,
    };

    try {
      await updateOrder(updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((req) =>
          req.id === updatedOrder.id ? updatedOrder : req
        )
      );
      console.log(updatedOrder.id);
      console.log(Orders.id);
      handleDisapprovalClose();
    } catch (error) {
      console.error("Error processing the request:", error);
    }
  };

  const totalorders = orders.filter((order) => {
    const name = order.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalorders.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const ApprovalRequest = async (id, locationId) => {
    try {
      const requestToUpdate = orders.find((req) => req.id === id);

      if (!requestToUpdate) {
        console.error("Request not found");
        return;
      }

      requestToUpdate.status = 3;
      requestToUpdate.orderApproveStatus = true;
      //requestToUpdate.locationId = locationId; // Add selected location ID to the request

      const updatedRequests = orders.map((req) =>
        req.id === id
          ? {
              ...req,
              status: requestToUpdate.status,
              orderApproveStatus: requestToUpdate.orderApproveStatus,
              //locationId: requestToUpdate.locationId,
            }
          : req
      );

      setOrders(updatedRequests);
      updateOrder(requestToUpdate);
    } catch (error) {
      console.error("Error updating request status with location ID:", error);
    }
  };

  const updateOrder = async (requestToUpdate) => {
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
        orderApproveStatus: requestToUpdate.orderApproveStatus,
        //locationId: requestToUpdate.locationId,
      }),
    });
    fetchOrders();

    if (updateResponse.ok) {
      console.log("Request status updated successfully.");
    } else {
      console.error("Failed to update request status.");
    }
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
                {totalorders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.name}</td>

                    <OverlayTrigger
                      trigger="click"
                      placement="right"
                      overlay={popover}
                      show={activeChemicalId === order.chemicalId} //
                    >
                      <td
                        style={{ color: "#0d6efd" }}
                        onClick={() => handlePopoverToggle(order.chemicalId)}
                      >
                        {order.chemicalId}
                      </td>
                    </OverlayTrigger>

                    <td>{order.supervisorComment}</td>
                    <td>{order.higherApproveComment}</td>
                    <td>{order.orderComment}</td>
                    <td>status</td>
                    <td className="text-center ">
                      <div className="d-flex justify-content-center mb-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleApprovalShow(order.id)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDisapprovalShow(order)}
                        >
                          Reject
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

          {/* Pagination */}
          <div className="d-flex justify-content-end align-items-center mt-4">
            <span className="me-3">
              {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                totalorders.length
              )} of ${totalorders.length} items`}
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

          {/* Toast Message for Adding & Deleting order */}
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
          <Modal show={showModal} onHide={handleApprovalClose}>
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
                    value={selectedLocationId} // Bind the selected location ID
                    onChange={(e) => setSelectedLocationId(e.target.value)} // Update state when a location is selected
                  >
                    <option value="" disabled>
                      Select a location
                    </option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.orgName}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <div class="d-grid gap-2 col-6 mx-auto">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmApproval}
                  onToggle={closeApprovalRequest}
                >
                  {/* {params.id ? "Save Changes" : "Add order"} */}
                  Approve
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
                  <label htmlFor="orderName" className="form-label">
                    Comment:
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="comment"
                    //value={params.orderApproveComment || ""}
                    style={{ height: "200px" }}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        orderApproveComment: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="disapproval-submit"
                >
                  {/* {params.id ? "Save Changes" : "Add order"} */}
                  Disapprove
                </button>
              </form>
            </Modal.Body>
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
                  {/* {params.id ? "Save Changes" : "Add order"} */}
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
