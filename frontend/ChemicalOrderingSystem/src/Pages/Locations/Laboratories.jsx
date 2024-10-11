import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import axios from "axios";
import IconUserPlus from "../../Assets/Icon/IconUserPlus.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";

const Laboratories = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [laboratories, setLaboratories] = useState([]);
  const [params, setParams] = useState({
    orgName: "",
    orgType: "4", // For Laboratories
    id: null,
  });
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;
  const orgType = 4;
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      document.title = "Laboratories";
      fetchLaboratories();
    }
  }, [id]);

  const fetchLaboratories = async () => {
    try {
      const response = await axios.get(
        `/api/organizational-units/listByOrgType/${params.orgType}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data.data;
      if (Array.isArray(data)) {
        setLaboratories(data);
      } else {
        console.error("Expected an array but received:", data);
      }
    } catch (error) {
      console.error("Error fetching laboratories:", error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const saveLaboratory = async () => {
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

      fetchLaboratories();
      handleClose();
    } catch (error) {
      console.error("Error saving laboratory:", error);
    }
  };

  const editLaboratory = (laboratory) => {
    setParams(laboratory);
    handleShow();
  };

  const addLaboratory = () => {
    setParams({ orgName: "", orgType: "4", id: null });
    handleShow();
  };

  const deleteLaboratory = async (laboratory) => {
    try {
      await axios.delete(`/api/locations/${laboratory.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchLaboratories();
    } catch (error) {
      console.error("Error deleting laboratory:", error);
    }
  };

  const totalLaboratories = laboratories.filter((lab) =>
    lab.orgName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(totalLaboratories.length / itemsPerPage);

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
            <h2 className="h4 mb-0">Laboratories</h2>
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center px-4"
                onClick={addLaboratory}
              >
                <IconUserPlus className="me-2" />
                Add New Laboratory
              </button>
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search laboratory"
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="button" className="btn position-absolute end-0">
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
                {totalLaboratories
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((lab) => (
                    <tr key={lab.id}>
                      <td>{lab.id}</td>
                      <td>{lab.orgName}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => editLaboratory(lab)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteLaboratory(lab)}
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
          <div className="d-flex justify-content-end align-items-center mt-4">
            <span className="me-3">
              {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                totalLaboratories.length
              )} of ${totalLaboratories.length} items`}
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

          {/* Modal for Add/Edit */}
          <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {params.id ? "Edit Laboratory" : "Add Laboratory"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="orgName" className="form-label">
                    Organization Name
                  </label>
                  <input
                    id="orgName"
                    type="text"
                    className="form-control"
                    value={params.orgName}
                    onChange={(e) =>
                      setParams({ ...params, orgName: e.target.value })
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
                onClick={saveLaboratory}
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

export default Laboratories;
