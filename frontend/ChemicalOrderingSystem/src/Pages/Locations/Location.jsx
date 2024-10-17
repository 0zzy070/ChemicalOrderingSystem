import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import IconUserPlus from "../../Assets/Icon/IconUserPlus.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";
import LocationTypeModal from "./LocationTypeModal.jsx";

const Location = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLocationTypeModal, setShowLocationTypeModal] = useState(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState({
    pid: "",
    orgName: "",
    orgType: "",
    instituteId: "",
    id: null,
    researchCentreId: null,
  });
  const [locations, setLocations] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [researchCentres, setResearchCentres] = useState([]);
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;

  useEffect(() => {
    document.title = "Locations";
    fetchLocations();
  }, [search, currentPage]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `/api/organizational-units/listByOrgType/1`,
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

  const fetchInstitutes = async () => {
    try {
      const response = await axios.get(
        `/api/organizational-units/listByOrgType/1`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setInstitutes(response.data.data);
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const fetchStorageLocations = async () => {
    try {
      const response = await axios.get(
        `/api/organizational-units/listByOrgType/2`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setResearchCentres(response.data);
    } catch (error) {
      console.error("Error fetching research centres:", error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setParams({
      orgName: "",
      orgType: null,
      instituteId: null,
      researchCentreId: null,
    });
  };

  const handleOrgTypeChange = (e) => {
    const selectedOrgType = e.target.value;
    setParams((prevParams) => ({
      ...prevParams,
      orgType: selectedOrgType,
    }));
  };

  useEffect(() => {
    if (params.orgType == 2) {
      fetchInstitutes();
    } else if (params.orgType == 3) {
      fetchInstitutes();
    }
  }, [params.orgType]);

  const saveLocation = async () => {
    try {
      const apiUrl = `/api/organizational-units/createOrganizationalUnit`;

      if (params.orgType == "2") {
        const payload = {
          pid: params.instituteId || null,
          orgName: params.orgName,
          orgType: params.orgType,
          hasSpecialEquipment:
            params.orgType === 2 ? params.hasSpecialEquipment : 0,
        };

        await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else if (params.orgType == "3") {
        const payload = {
          pid: params.researchCentreId || null,
          orgName: params.orgName,
          orgType: params.orgType,
          hasSpecialEquipment:
            params.orgType === 2 ? params.hasSpecialEquipment : 0,
        };

        await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      fetchLocations();
      handleClose();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const deleteLocation = async (location) => {
    try {
      await axios.post(`/api/organizational-units/deleteById/${location.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const totalLocations = locations.filter((location) =>
    location.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(totalLocations.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleShowLocationTypeModal = () => setShowLocationTypeModal(true);
  const handleCloseLocationTypeModal = () => setShowLocationTypeModal(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const openLocationTypeModal = (locationId) => {
    setSelectedLocationId(locationId);
    setShowLocationTypeModal(true);
  };

  const handleOptionSelect = (type) => {
    setShowLocationTypeModal(false);

    switch (type) {
      case "locationStorage":
        window.location.href = `/storagelocations/${selectedLocationId}`;
        break;
      case "research":
        window.location.href = `/researchcentre/${selectedLocationId}`;
        break;
      default:
        break;
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
              <h2 className="h4 mb-0">All Locations</h2>
            </div>
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center px-4"
                onClick={handleShow}
              >
                <IconUserPlus className="me-2" />
                Add Location
              </button>
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search Locations"
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
                  <th></th>
                  <th>ID</th>
                  <th>Organization Name</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {totalLocations.map((location) => (
                  <tr key={location.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={require("../../Assets/Images/blank-profile.png")}
                          className="rounded-circle me-2"
                          alt="profilepic"
                          style={{ width: "36px", height: "36px" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span
                        role="button"
                        onClick={() => openLocationTypeModal(location.id)}
                        style={{
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                      >
                        {location.id}
                      </span>
                    </td>
                    <td>{location.orgName}</td>
                    <td className="text-center">
                      {/*
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => editLocation(location)}
                      >
                        Edit
                      </button>
                      */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteLocation(location)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
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
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>"Add Location"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="orgName" className="form-label">
                Organization Name
              </label>
              <input
                type="text"
                className="form-control"
                id="orgName"
                value={params.orgName}
                onChange={(e) =>
                  setParams({ ...params, orgName: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label htmlFor="orgType" className="form-label">
                Location Type
              </label>
              <select
                className="form-control"
                id="orgType"
                value={params.orgType}
                onChange={handleOrgTypeChange}
              >
                <option value="">Select Location Type</option>
                <option value={2}>Storage Location</option>
                <option value={3}>Research Centre</option>
                <option value={4}>Laboratory</option>
              </select>
            </div>

            {params.orgType == "2" && (
              <div className="mb-3">
                <label htmlFor="instituteId" className="form-label">
                  Select Institute
                </label>
                <select
                  className="form-control"
                  id="instituteId"
                  value={params.instituteId}
                  onChange={(e) =>
                    setParams({ ...params, instituteId: e.target.value })
                  }
                >
                  <option value="">Select Institute</option>
                  {Array.isArray(institutes) &&
                    institutes.map((institute) => (
                      <option key={institute.id} value={institute.id}>
                        {institute.orgName}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {params.orgType == "3" && (
              <div className="mb-3">
                <label htmlFor="researchCentreId" className="form-label">
                  Select Research Centre
                </label>
                <select
                  className="form-control"
                  id="researchCentreId"
                  value={params.researchCentreId}
                  onChange={(e) =>
                    setParams({ ...params, researchCentreId: e.target.value })
                  }
                >
                  <option value="">Select Institute</option>
                  {Array.isArray(institutes) &&
                    institutes.map((institute) => (
                      <option key={institute.id} value={institute.id}>
                        {institute.orgName}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/*
            <div className="mb-3">
              <label htmlFor="hasSpecialEquipment" className="form-label">
                Special Equipment Available
              </label>
              <select
                className="form-control"
                id="hasSpecialEquipment"
                value={params.hasSpecialEquipment}
                onChange={(e) =>
                  setParams({
                    ...params,
                    hasSpecialEquipment: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
            */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={saveLocation}>
            "Add Location"
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal for selecting location type */}
      <LocationTypeModal
        show={showLocationTypeModal}
        handleClose={handleCloseLocationTypeModal}
        handleOptionSelect={handleOptionSelect}
        value={1}
      />
    </div>
  );
};

export default Location;
