import { useState } from "react";
import { Modal } from "react-bootstrap";
import React from "react";
import IconFlask from "../../Assets/Icon/IconChemicalFlaskPlus.tsx";
import IconListCheck from "../../Assets/Icon/IconListCheck.tsx";
import IconLayoutGrid from "../../Assets/Icon/IconLayoutGrid.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";
import defaultChemicalImg from "../../Assets/Images/default-chemical.jpg";

const Chemicals = () => {
  const [search, setSearch] = useState("");
  const [chemicals, setChemicals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState({
    common_name: "",
    systematic_name: "",
    risk_category: null,
    storage_period: null,
    id: null,
  });

  const Chemicals = [
    {
      id: 1,
      common_name: "Acetone",
      systematic_name: "Propan-2-one",
      risk_category: 2,
      storage_period: 3,
      path: "blank-profile.png",
    },
    {
      id: 2,
      common_name: "Hydrochloric Acid",
      systematic_name: "Hydrogen chloride",
      risk_category: 1,
      storage_period: 5,
      path: "blank-profile.png",
    },

    // Add more contacts here
  ];

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const saveChemical = () => handleClose();
  const editChemical = (chemical) => {
    setParams(chemical);
    handleShow();
  };
  const deleteChemical = (chemical) =>
    console.log("Delete chemical:", chemical);

  const totalChemicals = chemicals.filter((location) =>
    chemicals.orgName.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalChemicals.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
              <h2 className="h4 mb-0">Chemicals</h2>
            </div>
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center px-4"
                onClick={() => editChemical({})}
              >
                <IconFlask className="me-2" />
                Add a Chemcial
              </button>
              <div className="position-relative d-flex">
                <input
                  type="text"
                  placeholder="Search Chemicals"
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

          <div className="row mt-5">
            {Chemicals.map((chemical) => (
              <div
                className="col-xl-3 col-lg-4 col-md-6 mb-4"
                key={chemical.id}
              >
                <div className="card text-center shadow">
                  <div className="card-body p-4">
                    <img
                      className="card-img-top rounded-circle mx-auto d-block"
                      src={defaultChemicalImg}
                      alt="chemical"
                      style={{ width: "70%", height: "150px" }}
                    />
                    <h5 className="card-title mt-4">{chemical.common_name}</h5>
                    {/* <p className="card-text">{chemical.risk_category}</p> */}
                    <div className="mt-4 text-start">
                      <p>
                        <strong>Systematic Name:</strong>{" "}
                        {chemical.systematic_name}
                      </p>
                      <p>
                        <strong>Risk Category:</strong> {chemical.risk_category}
                      </p>
                      <p>
                        <strong>Storage Period:</strong>{" "}
                        {chemical.storage_period}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => editChemical(chemical)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => deleteChemical(chemical)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end align-items-center mt-4">
            <span className="me-3">
              {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                chemicals.length
              )} of ${chemicals.length} items`}
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
                {params.id ? "Edit Chemical" : "Add Chemical"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="common_name" className="form-label">
                    Common Name
                  </label>
                  <input
                    id="common_name"
                    type="text"
                    className="form-control"
                    value={params.common_name}
                    onChange={(e) =>
                      setParams({ ...params, common_name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="systematic_name" className="form-label">
                    Systematic Name
                  </label>
                  <input
                    id="systematic_name"
                    type="text"
                    className="form-control"
                    value={params.systematic_name}
                    onChange={(e) =>
                      setParams({ ...params, systematic_name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="risk_category" className="form-label">
                    Risk Category
                  </label>
                  <input
                    id="risk_category"
                    type="text"
                    className="form-control"
                    value={params.risk_category}
                    onChange={(e) =>
                      setParams({ ...params, risk_category: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="storage_period" className="form-label">
                    Storage Period
                  </label>
                  <input
                    id="storage_period"
                    type="text"
                    className="form-control"
                    value={params.storage_period}
                    onChange={(e) =>
                      setParams({ ...params, storage_period: e.target.value })
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
                onClick={saveChemical}
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

export default Chemicals;
