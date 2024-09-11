import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import IconUserPlus from "../../Assets/Icon/IconUserPlus.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";

const Institutes = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    id: null,
  });
  const [institutes, setInstitutes] = useState([]);
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;
  const orgType = 1;

  useEffect(() => {
    document.title = "Institutions";
    fetchInstitutes();
  });

  const fetchInstitutes = async () => {
    try {
      const response = await axios.get(
        `/api/organizational-units/listByOrgType/${orgType}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Access the 'data' property of the response object
      const data = response.data.data;

      // If the response.data is an object containing the array
      if (Array.isArray(data)) {
        setInstitutes(data);
      } else {
        console.error("Expected an array but received:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const saveInstitute = async () => {
    try {
      if (params.id) {
        await axios.put(
          `https://your-api-endpoint.com/locations/${params.id}`,
          params
        );
      } else {
        await axios.post("https://your-api-endpoint.com/locations", params);
      }
      //fetchLocations();
      handleClose();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const editInstitute = (institute) => {
    setParams(institute);
    handleShow();
  };

  const addInstitute = (institute) => {
    setParams(institute);
    handleShow();
  };

  const deleteInstitute = async (institute) => {
    try {
      await axios.delete(
        `https://your-api-endpoint.com/locations/${institute.id}`
      );
      //fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const totalInstitutes = institutes.filter((institutes) =>
    institutes.orgName.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalInstitutes.length / itemsPerPage);

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
              <h2 className="h4 mb-0">Institutes</h2>
            </div>
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center px-4"
                onClick={() => addInstitute({})}
              >
                <IconUserPlus className="me-2" />
                Add Location
              </button>
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search Institutes"
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
                {totalInstitutes.map((institute) => (
                  <tr key={institute.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={require("../../Assets/Images/blank-profile.png")}
                          className="rounded-circle me-2"
                          alt="profilepic"
                          style={{ width: "36px", height: "36px" }}
                        />
                        <div>{institute.id}</div>
                      </div>
                    </td>
                    <td>{institute.orgName}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => editInstitute(institute)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteInstitute(institute)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-end align-items-center mt-4">
          <span className="me-3">
            {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
              currentPage * itemsPerPage,
              totalInstitutes.length
            )} of ${totalInstitutes.length} items`}
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

        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {params.id ? "Edit Location" : "Add Location"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Oragnization Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  value={params.orgName}
                  onChange={(e) =>
                    setParams({ ...params, orgName: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Organization Type
                </label>
                <input
                  id="type"
                  type="text"
                  className="form-control"
                  value={params.orgType}
                  onChange={(e) =>
                    setParams({ ...params, orgType: e.target.value })
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
              onClick={saveInstitute}
            >
              {params.id ? "Update" : "Add"}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Institutes;
