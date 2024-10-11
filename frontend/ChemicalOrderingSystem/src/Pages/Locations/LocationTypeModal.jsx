import React from "react";
import { Modal, Button } from "react-bootstrap";

// LocationTypeModal.js
const LocationTypeModal = ({
  show,
  handleClose,
  handleOptionSelect,
  value,
}) => {
  let modalButton1;
  let modalButton2;
  let buttonName;
  if (value === 1) {
    modalButton1 = "locationStorage";
    modalButton2 = "research";
    buttonName = "Research Centre";
  } else if (value === 2) {
    modalButton1 = "researchStorage";
    modalButton2 = "laboratory";
    buttonName = " Laboratory";
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Location Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-3">
          <Button
            variant="outline-primary"
            onClick={() => handleOptionSelect(modalButton1)}
          >
            Storage Location
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => handleOptionSelect(modalButton2)}
          >
            {buttonName}
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationTypeModal;
