import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import IconUsers from "../../Assets/Icon/IconUsersGroup.tsx";
import IconFlask from "../../Assets/Icon/IconChemicalFlask.tsx";
import IconNotification from "../../Assets/Icon/IconBellBing.tsx";
import IconBuilding from "../../Assets/Icon/IconBuilding.tsx";
import IconX from "../../Assets/Icon/IconX.tsx";
import "../Styles/SideBar.css";
import IconListCheck from "../../Assets/Icon/IconFa6SolidListCheck.tsx";
import IconUserCheck from "../../Assets/Icon/IconTablerUserCheck.tsx";
import IconRiShoppingCartLine from "../../Assets/Icon/IconRiShoppingCartLine.tsx";
import IconLucideListTodo from "../../Assets/Icon/IconLucideListTodo.tsx";
const SideBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="">
      <div className="bg-light side-bar">
        <Nav defaultActiveKey="/users" className="flex-column">
          <Nav.Link href="/users" className="d-flex align-items-center">
            <IconUsers />
            <span>Users</span>
          </Nav.Link>
          <Nav.Link href="/location" className="d-flex align-items-center">
            <IconBuilding />
            <span>Locations</span>
          </Nav.Link>
          <Nav.Link href="/chemicals" className="d-flex align-items-center">
            <IconFlask />
            <span>Chemicals</span>
          </Nav.Link>
          <Nav.Link href="/approvals" className="d-flex align-items-center">
            <IconListCheck />
            <span>Approvals</span>
          </Nav.Link>
          <Nav.Link href="/higherApprovals" className="d-flex align-items-center">
            <IconUserCheck />
            <span>Higher Approvals</span>
          </Nav.Link>
          <Nav.Link href="/orders" className="d-flex align-items-center">
            <IconRiShoppingCartLine />
            <span>Orders</span>
          </Nav.Link>
          <Nav.Link href="/experiments" className="d-flex align-items-center">
            <IconLucideListTodo />
            <span>Experiments</span>
          </Nav.Link>
          <Nav.Link
            onClick={handleDrawerToggle}
            className="d-flex align-items-center"
          >
            <IconNotification />
            <span>Notifications</span>
          </Nav.Link>
        </Nav>
      </div>
      <div
        className={`notifications--drawer ${isDrawerOpen ? "open" : ""}`}
        data-se="notification-drawer"
      >
        <header className="notifications--drawer-header">
          <h4
            className="notifications--drawer-header-label"
            data-se="notification-drawer-header-label"
          >
            Notifications
          </h4>
          <button
            className="notifications--drawer-close"
            data-se="notifications-drawer-close"
            aria-label="Close drawer"
            onClick={closeDrawer}
          >
            <IconX />
          </button>
        </header>
        <main>
          <button
            className="notification-item"
            tabIndex="0"
            data-se="notification-item"
            aria-pressed="false"
          >
            <div className="notification-content">
              <div className="notification-header">
                <span className="notification-title">
                  You were assigned new apps
                </span>
                <span className="notification-date">Aug 24th</span>
              </div>
              <div className="notification-body">
                Your IT admin installed new apps on your dashboard
              </div>
            </div>
          </button>
        </main>
      </div>
    </div>
  );
};

export default SideBar;
