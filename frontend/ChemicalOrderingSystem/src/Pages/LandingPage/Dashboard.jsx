import { useEffect } from "react";
import NavigationBar from "../../Components/Layouts/NavigationBar";
import SideBar from "../../Components/Layouts/SideBar";
import "./Dashboard.css";

function Dashboard() {
  useEffect(() => {
    document.title = "Welcome to your Dashborad";
  }, []);
  return (
    <div>
      <NavigationBar></NavigationBar>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-2">
              <SideBar></SideBar>
            </div>
            <div className="col">
              <div className="default-dashboard">
                <div className="title">
                  <h3>Welcome to our System!</h3>
                </div>
                <div className="cards">
                  <div
                    className="bigCard card"
                    style={{ backgroundColor: "#DAE7FF" }}
                  >
                    <h4>Users</h4>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Aperiam rerum nemo modi a exercitationem necessitatibus
                    </p>
                  </div>
                  <div className="smallCards">
                    <div
                      className="card"
                      style={{ backgroundColor: "#7DA0FA" }}
                    >
                      <h4>Users</h4>
                      <p className="fs-30 mb-2">4006</p>
                      <p>10.00% (30 days)</p>
                    </div>
                    <div
                      className="card"
                      style={{ backgroundColor: "#4747A1" }}
                    >
                      <h4>Total chemicals</h4>
                      <p>1000</p>
                    </div>
                    <div
                      className="card"
                      style={{ backgroundColor: "#7978E9" }}
                    >
                      <h4>Approvals</h4>
                      <p>2 Approvals Needed</p>
                    </div>
                    <div
                      className="card"
                      style={{ backgroundColor: "#F3797E" }}
                    >
                      <h4>Pending orders</h4>
                      <p>20 Orders Pending</p>
                    </div>
                  </div>
                </div>
                <div className="card" style={{ backgroundColor: "#DAE7FF" }}>
                  <h4>Users</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aperiam rerum nemo modi a exercitationem necessitatibus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
