import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import IconUserPlus from "../../Assets/Icon/IconUserPlus.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";
import LocationTypeModal from "./LocationTypeModal.jsx";

const ResearchCentres = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLocationTypeModal, setShowLocationTypeModal] = useState(false);
  const [params, setParams] = useState({
    orgName: "",
    hasSpecialEquipment: "",
    id: null,
  });
  const [centres, setCentres] = useState([]);
  const [formValues, setFormValues] = useState({
    orgName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCentreId, setSelectedCentreId] = useState(null);
  const itemsPerPage = 10;
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;
  const orgType = 3;
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      document.title = "Research Centres";
      fetchCentres(id); // Fetch the research centres based on the URL parameter
    }
  }, [id]);

  const fetchCentres = async (id) => {
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
        setCentres(data);
      } else {
        console.error("Expected an array but received:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const saveCentre = async () => {
    try {
      const url = params.id
        ? `/api/organizational-units/updateUnitById`
        : `/api/organizational-units/createOrganizationalUnit`;

      const method = "post";

      const data = params.id
        ? {
            orgName: params.orgName,
            hasSpecialEquipment: 0,
            id: params.id,
          }
        : {
            orgName: params.orgName,
            hasSpecialEquipment: 0,
            orgType: orgType,
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
      fetchCentres(id);
      handleClose();
    } catch (error) {
      console.error("Error saving centre:", error);
    }
  };

  const handleClose = () => setShowModal(false);

  const handleShowLocationTypeModal = () => setShowLocationTypeModal(true);
  const handleCloseLocationTypeModal = () => setShowLocationTypeModal(false);

  const openLocationTypeModal = (centreId) => {
    setSelectedCentreId(centreId);
    setShowLocationTypeModal(true);
  };

  const handleOptionSelect = (type) => {
    setShowLocationTypeModal(false);

    switch (type) {
      case "researchStorage":
        window.location.href = `/storagelocations/${selectedCentreId}`;
        break;
      case "laboratory":
        window.location.href = `/laboratory/${selectedCentreId}`;
        break;
      default:
        break;
    }
  };

  const editCentre = (centre) => {
    setParams(centre);
    handleShow();
  };

  const addCentre = () => {
    handleShow();
  };

  const deleteCentre = async (centre) => {
    try {
      await axios.delete(`/api/organizational-units/deleteById/${centre.id}`);
      fetchCentres();
    } catch (error) {
      console.error("Error deleting centre:", error);
    }
  };

  const totalCentres = centres.filter((centre) =>
    centre.orgName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(totalCentres.length / itemsPerPage);
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
              <h2 className="h4 mb-0">Research Centres</h2>
            </div>
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center px-4"
                onClick={handleShow}
              >
                <IconUserPlus className="me-2" />
                Add Research Centre
              </button>
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search Centres"
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
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {totalCentres.map((centre) => (
                  <tr key={centre.id}>
                    <td>
                      <span
                        role="button"
                        onClick={() => openLocationTypeModal(centre.id)}
                        style={{
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                      >
                        {centre.id}
                      </span>
                    </td>
                    <td>{centre.orgName}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => editCentre(centre)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteCentre(centre)}
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
                {params.id ? "Edit Research Centre" : "Add Research Centre"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="centreName" className="form-label">
                    Research Centre Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="centreName"
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
                    value={params.hasSpecialEquipment}
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
              <button className="btn btn-primary" onClick={saveCentre}>
                {params.id ? "Save Changes" : "Add Centre"}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>

      {/* Modal for selecting location type */}
      <LocationTypeModal
        show={showLocationTypeModal}
        handleClose={handleCloseLocationTypeModal}
        handleOptionSelect={handleOptionSelect}
        value={2}
      />
    </div>
  );
};

export default ResearchCentres;
