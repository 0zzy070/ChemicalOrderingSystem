import { useState,useEffect } from "react";
import { Modal,Toast, ToastContainer } from "react-bootstrap";
import React from "react";
import IconFlask from "../../Assets/Icon/IconChemicalFlaskPlus.tsx";
// import IconListCheck from "../../Assets/Icon/IconListCheck.tsx";
// import IconLayoutGrid from "../../Assets/Icon/IconLayoutGrid.tsx";
import IconSearch from "../../Assets/Icon/IconSearch.tsx";
import NavigationBar from "../../Components/Layouts/NavigationBar.jsx";
import SideBar from "../../Components/Layouts/SideBar.jsx";
import defaultChemicalImg from "../../Assets/Images/default-chemical.jpg";
import axios from "axios";

const Chemicals = () => {
  const [search, setSearch] = useState("");
  const [chemicals, setChemicals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState({
    commonName: "",
    systematicName: "",
    riskCategory: null,
    storagePeriod: null,
    id: null,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const token = JSON.parse(localStorage.getItem("auth"));
  const accessToken = token.accessToken;

  useEffect(() => {
    document.title = "Chemicals";
    console.log(chemicals);
    fetchChemicals(); // Fetch users when the component mounts
    console.log("chemicals", chemicals);
  }, []);

  // Function to fetch chemicals
  const fetchChemicals = async () => {
    try {
      const response = await axios.get("/api/chemicals", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the token in the Authorization header
        },
      });
      console.log("Chemicals:", response.data.data);
      setChemicals(response.data.data);
    } catch (error) {
      console.error("Error fetching chemicals:", error);
    }
  };

  // const Chemicals = [
  //   {
  //     id: 1,
  //     commonName: "Acetone",
  //     systematicName: "Propan-2-one",
  //     riskCategory: 2,
  //     storagePeriod: 3,
  //     path: "blank-profile.png",
  //   },
  //   {
  //     id: 2,
  //     commonName: "Hydrochloric Acid",
  //     systematicName: "Hydrogen chloride",
  //     riskCategory: 1,
  //     storagePeriod: 5,
  //     path: "blank-profile.png",
  //   },

  //   // Add more contacts here
  // ];

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  // Add a new Chemical
  const addChemical = (chemical) => {
    setParams(chemical);
    handleShow();
  };

  const saveChemical = async() => {
    try {
      // Construct the API URL
      let url = "/api/chemicals";
      let method = "post";

      console.log("params", params);
      // Determine the HTTP method
      if (params.id) {
        url = `/api/chemicals/${params.id}`;
        method = "patch";
      }
      console.log("url", url);

      // Make the POST request with the user data and access token
      await axios({
        method: method,
        url: url,
        data: params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // Optionally, update the UI or state after successful save
      console.log("Chemical saved successfully");
      setToastMessage(params.id ? "Chemical updated successfully!" : "Chemical added successfully!");
      setShowToast(true); // Show the toast notification

      // Refresh the user list or update the state
      fetchChemicals(); // Fetch the latest user list
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };
  
  const editChemical = (chemical) => {
    setParams(chemical);
    handleShow();
  };

  

  const deleteChemical = async (chemical) =>{
    try {
      // Construct the API URL with the user ID
      const url = `api/chemicals/${chemical.id}`;

      // Make the DELETE request with the access token
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Optionally, update the UI or state after successful deletion
      console.log("Chemical deleted successfully");
      setToastMessage("chemicals deleted successfully!");
      setShowToast(true); // Show the toast notification

      // Refresh the Chemical list or update the state
      fetchChemicals(); // Fetch the latest Chemical list
    } catch (error) {
      console.error("Error deleting Chemical:", error);
    }
  };

  const totalChemicals = chemicals.filter((chemical) =>{
    const chemicalName = chemical.commonName || "";
    return chemicalName.toLowerCase().includes(search.toLowerCase());
    }
  );

  const searchChemical = () => {
    if (search === "") {
      fetchChemicals();
    }
    console.log("search", search);
    console.log("totalChemicals", totalChemicals);
    setChemicals(totalChemicals);
  }

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
                onClick={() => addChemical({})}
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
                  onClick={() => searchChemical({})}
                >
                  <IconSearch />
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            {chemicals.map((chemical) => (
              <div
                className="col-xl-3 col-lg-4 col-md-6 mb-4"
                key={chemical.id}
              >
                <div className="card text-center shadow h-100">
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <img
                      className="card-img-top rounded-circle mx-auto d-block"
                      src={defaultChemicalImg}
                      alt="chemical"
                      style={{ width: "70%", height: "150px" }}
                    />
                    <h5 className="card-title mt-4">{chemical.commonName}</h5>
                    {/* <p className="card-text">{chemical.riskCategory}</p> */}
                    <div className="mt-4 text-start">
                      <p>
                        <strong>Systematic Name:</strong>{" "}
                        {chemical.systematicName}
                      </p>
                      <p>
                        <strong>Risk Category:</strong> {chemical.riskCategory}
                      </p>
                      <p>
                        <strong>Storage Period:</strong>{" "}
                        {chemical.storagePeriod}
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

          <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {params.id ? "Edit Chemical" : "Add Chemical"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="commonName" className="form-label">
                    Common Name
                  </label>
                  <input
                    id="commonName"
                    type="text"
                    className="form-control"
                    value={params.commonName}
                    onChange={(e) =>
                      setParams({ ...params, commonName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="systematicName" className="form-label">
                    Systematic Name
                  </label>
                  <input
                    id="systematicName"
                    type="text"
                    className="form-control"
                    value={params.systematicName}
                    onChange={(e) =>
                      setParams({ ...params, systematicName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="riskCategory" className="form-label">
                    Risk Category
                  </label>
                  <input
                    id="riskCategory"
                    type="text"
                    className="form-control"
                    value={params.riskCategory}
                    onChange={(e) =>{
                      const intValue = parseInt(e.target.value, 10);
                      setParams({ ...params, riskCategory: isNaN(intValue) ? '' : intValue  });
                      }
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="storagePeriod" className="form-label">
                    Storage Period
                  </label>
                  <input
                    id="storagePeriod"
                    type="text"
                    className="form-control"
                    value={params.storagePeriod}
                    onChange={(e) =>{
                      const intValue = parseInt(e.target.value, 10);
                      setParams({ ...params, storagePeriod: isNaN(intValue) ? '' : intValue  });
                      }
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
