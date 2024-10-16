import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import IconUserPlus from "../../Assets/Icon/IconUserPlus.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";

const StorageLocations = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [params, setParams] = useState({
    orgName: "",
    hasSpecialEquipment: "",
    id: null,
  });
  const [storages, setStorages] = useState([]);
  const [formValues, setFormValues] = useState({
    orgName: "",
  });
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;
  const orgType = 2;
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      document.title = "Storage Locations";
      fetchStorages(id);
    }
  }, [id]);

  const fetchStorages = async (id) => {
    try {
      const response = await axios.get(
        `/api/organizational-units/listDirectChildrenUnit/${id}/${orgType}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data.data;
      if (Array.isArray(data)) {
        setStorages(data);
      } else {
        console.error("Expected an array but received:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleShow = () => {
    setShowModal(true);
    setFormValues({
      orgName: "",
    });
  };

  const saveStorage = async () => {
    try {
      const url = params.id
        ? `/api/organizational-units/updateUnitById`
        : `/api/organizational-units/createOrganizationalUnit`;

      const method = params.id ? "post" : "post";

      const data = params.id
        ? {
            orgName: params.orgName,
            hasSpecialEquipment: params.hasSpecialEquipment,
            id: id,
          }
        : {
            orgName: params.orgName,
            hasSpecialEquipment: params.hasSpecialEquipment,
            orgType: 2,
            pid: id,
          };

      const response = await axios({
        method: method,
        url: url,
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("API Response:", response.data);
      fetchStorages(id); // Refresh the list after saving
      handleClose(); // Close the modal after save
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleClose = () => setShowModal(false);

  const editStorage = (storage) => {
    setParams(storage);
    handleShow();
  };

  const addStorage = () => {
    handleShow();
  };

  const deleteStorage = async (storage) => {
    try {
      await axios.delete(`/api/organizational-units/deleteById/${storage.id}`);
      fetchStorages();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const totalStorages = storages.filter((storage) =>
    storage.orgName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(totalStorages.length / itemsPerPage);
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle input changes in the form
  /*
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    saveStorage(formValues); // Save the form data
  };
*/
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
              <h2 className="h4 mb-0">Storage Locations</h2>
            </div>
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center px-4"
                onClick={handleShow}
              >
                <IconUserPlus className="me-2" />
                Add Storage Location
              </button>
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search Stroages"
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
                  <th>ID</th>
                  <th>Organization Name</th>
                  <th>Has Special Equipment</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {totalStorages.map((storage) => (
                  <tr key={storage.id}>
                    <td>{storage.id}</td>
                    <td>{storage.orgName}</td>
                    <td>
                      {storage.hasSpecialEquipment === "1" ? "Yes" : "No"}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => editStorage(storage)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteStorage(storage)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {params.id ? "Edit Storage Location" : "Add Storage Location"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="storageLocationName" className="form-label">
                    Storage Location Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="storageLocationName"
                    value={params.orgName}
                    onChange={(e) =>
                      setParams({ ...params, orgName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="hasSpecialEquipment" className="form-label">
                    Special Equipment Available
                  </label>
                  <select
                    className="form-control"
                    id="hasSpecialEquipment"
                    value={params.hasSpecialEquipment || ""}
                    onChange={(e) => {
                      setParams({
                        ...params,
                        hasSpecialEquipment: e.target.value,
                      });
                    }}
                  >
                    <option value="">Select</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveStorage}>
                {params.id ? "Save Changes" : "Add Location"}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default StorageLocations;
