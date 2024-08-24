import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import IconUser from "../../Assets/Icon/IconUser.tsx";
import IconSettings from "../../Assets/Icon/IconSettings.tsx";
import IconLogout from "../../Assets/Icon/IconLogout.tsx";
import "../Styles/NavBar.css";

//import userProfileImage from "../../Assets/Images/canvas-logo.png";
import blankUserImage from "../../Assets/Images/blank-profile.png";
import brandLogo from "../../Assets/Images/flinders-logo.png";

const NavigationBar = () => {
  return (
    <Navbar bg="light" expand="lg" className="navigation">
      <Container>
        <Navbar.Brand href="#home" className="navbar-brand">
          <img
            src={brandLogo}
            alt="Brand Logo"
            style={{ height: "40px" }} // Adjust the height as needed
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
            {/* Additional Nav items can be added here */}
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <img
                  className="rounded-circle"
                  src={blankUserImage}
                  alt="User Profile"
                  style={{ width: "36px", height: "36px" }}
                />
              }
              id="dropdown-custom-components"
              align="end"
            >
              <NavDropdown.Item as="div" className="d-flex align-items-center">
                <img
                  className="rounded-circle"
                  src={blankUserImage}
                  alt="User Profile"
                  style={{ width: "40px", height: "40px" }}
                />
                <div className="ms-2">
                  <h6 className="mb-1">
                    John Doe
                    <span className="badge bg-success ms-2">Pro</span>
                  </h6>
                  <button type="button" className="btn btn-link text-dark">
                    johndoe@gmail.com
                  </button>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/users/profile">
                <IconUser className="me-2" /> Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">
                <IconSettings className="me-2" /> Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as={Link}
                to="/auth/boxed-signin"
                className="text-danger"
              >
                <IconLogout className="me-2" /> Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
