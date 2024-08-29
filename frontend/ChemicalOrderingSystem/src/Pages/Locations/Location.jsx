import { useState } from "react";
import { Modal } from "react-bootstrap";
import React from "react";
import IconUserPlus from "../../Assets/Icon/IconUserPlus.tsx";
import IconListCheck from "../../Assets/Icon/IconListCheck.tsx";
import IconLayoutGrid from "../../Assets/Icon/IconLayoutGrid.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";
import blankUserImage from "../../Assets/Images/blank-profile.png";

const Location = () => {
  const [value, setValue] = useState("list");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [params, setParams] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    id: null,
  });

  const filteredItems = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      location: "Strut Campus",
      path: "blank-profile.png",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Research Staff",
      location: "Main Campus",
      path: "blank-profile.png",
    },
    {
      id: 3,
      name: "Joe Smith",
      email: "jane@example.com",
      role: "Research Staff",
      location: "Main Campus",
      path: "blank-profile.png",
    },
    {
      id: 4,
      name: "Jane Doe",
      email: "jane@example.com",
      role: "Supervisor",
      location: "Main Campus",
      path: "blank-profile.png",
    },
    {
      id: 5,
      name: "Doe Smith",
      email: "jane@example.com",
      role: "Student",
      location: "Main Campus",
      path: "blank-profile.png",
    },
    // Add more contacts here
  ];

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const saveUser = () => handleClose();
  const editUser = (contact) => {
    setParams(contact);
    handleShow();
  };
  const deleteUser = (contact) => console.log("Delete user:", contact);

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
              <h2 className="h4 mb-0">Users</h2>
              <div className="position-relative">
                <input
                  type="text"
                  placeholder="Search Users"
                  className="form-control py-2"
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
            <div className="d-flex gap-3">
              <button
                type="button"
                className={`btn btn-outline-primary p-2 ${
                  value === "list" && "bg-primary text-white"
                }`}
                onClick={() => setValue("list")}
              >
                <IconListCheck />
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary p-2 ${
                  value === "grid" && "bg-primary text-white"
                }`}
                onClick={() => setValue("grid")}
              >
                <IconLayoutGrid />
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => editUser({})}
              >
                <IconUserPlus className="me-2" />
                Add User
              </button>
            </div>
          </div>

          {value === "list" && (
            <div className="mt-5">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Role</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {user.path && (
                            //{`../../Assets/Images/${user.path}`}
                            <img
                              src={require("../../Assets/Images/blank-profile.png")}
                              className="rounded-circle me-2"
                              alt="profile-photo"
                              style={{ width: "36px", height: "36px" }}
                            />
                          )}
                          <div>{user.name}</div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.location}</td>
                      <td>{user.role}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => editUser(user)}
                        >
                          Edit
                        </button>
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
                      <h5 className="card-title mt-4">{user.name}</h5>
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
                          className="btn btn-outline-primary"
                          onClick={() => editUser(user)}
                        >
                          Edit
                        </button>
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

          <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{params.id ? "Edit User" : "Add User"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    value={params.name}
                    onChange={(e) =>
                      setParams({ ...params, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={params.email}
                    onChange={(e) =>
                      setParams({ ...params, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    className="form-control"
                    value={params.role}
                    onChange={(e) =>
                      setParams({ ...params, role: e.target.value })
                    }
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveUser}
              >
                {params.id ? "Update" : "Add"}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Location;
