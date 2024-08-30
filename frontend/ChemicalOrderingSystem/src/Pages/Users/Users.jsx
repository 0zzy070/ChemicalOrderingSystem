import { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios
import { Modal } from "react-bootstrap";
import React from "react";
import IconUserPlus from "../../Assets/Icon/IconUserPlus.tsx";
import IconListCheck from "../../Assets/Icon/IconListCheck.tsx";
import IconLayoutGrid from "../../Assets/Icon/IconLayoutGrid.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";

const Users = () => {
  const [value, setValue] = useState("list");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [params, setParams] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    id: null,
  });
  const [users, setUsers] = useState([]); // State to hold users data

  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;

  useEffect(() => {
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

    fetchUsers(); // Fetch users when the component mounts
  }, [accessToken]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const saveUser = async () => {
    try {
      // Construct the API URL
      const url = "/api/users";

      // Make the POST request with the user data and access token
      await axios.post(url, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Optionally, update the UI or state after successful save
      console.log("User saved successfully");
      // Refresh the user list or update the state
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error saving user:", error);
      // Optionally, show an error message to the user
    }
  };
  const addUser = (user) => {
    setParams(user);
    handleShow();
  };
  const deleteUser = async (user) => {
    try {
      // Construct the API URL with the user ID
      const url = `api/users/${user.id}`;

      // Make the DELETE request with the access token
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optionally, update the UI or state after successful deletion
      console.log("User deleted successfully");
      // You might want to refresh the user list or update the state
    } catch (error) {
      console.error("Error deleting user:", error);
      // Optionally, show an error message to the user
    }
  };

  // Filter items based on search
  const filteredItems = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Slice the filteredItems array to get the items for the current page
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
              <h2 className="h4 mb-0">Users</h2>
            </div>
            <div className="d-flex gap-3">
              <button
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
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary d-flex align-items-center ${
                  value === "grid" && "bg-primary text-white"
                }`}
                onClick={() => setValue("grid")}
              >
                <IconLayoutGrid />
              </button>
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search Users"
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
                    <th>Name</th>
                    <th>Employee Number</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={require("../../Assets/Images/blank-profile.png")}
                            className="rounded-circle me-2"
                            alt="profilepic"
                            style={{ width: "36px", height: "36px" }}
                          />
                          <div>{user.username}</div>
                        </div>
                      </td>
                      <td>{user.employeeNumber}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteUser(user)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {value === "grid" && (
            <div className="row mt-5">
              {filteredItems.map((user) => (
                <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={user.id}>
                  <div className="card text-center shadow">
                    <div className="card-body p-4">
                      <img
                        className="card-img-top rounded-circle mx-auto d-block"
                        src={require("../../Assets/Images/blank-profile.png")}
                        alt="user"
                        style={{ width: "80%", maxHeight: "160px" }}
                      />
                      <h5 className="card-title mt-4">{user.username}</h5>
                      <p className="card-text">{user.role}</p>
                      <div className="mt-4 text-start">
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                          <strong>Role:</strong> {user.role}
                        </p>
                        <p>
                          <strong>Location:</strong> {user.location}
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
          )}

          {/* Pagination */}
          <div className="d-flex justify-content-end align-items-center mt-4">
            <span className="me-3">
              {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                filteredItems.length
              )} of ${filteredItems.length} items`}
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

          {/* Modal for Adding/Editing Users */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{"Add User"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={params.username || ""}
                    onChange={(e) =>
                      setParams({ ...params, username: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={params.password || ""}
                    onChange={(e) =>
                      setParams({ ...params, password: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="authority" className="form-label">
                    Role
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="authority"
                    value={params.authority || ""}
                    onChange={(e) =>
                      setParams({ ...params, authority: e.target.value })
                    }
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveUser}
              >
                {params.id ? "Save Changes" : "Add User"}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Users;
