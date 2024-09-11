import { useEffect } from "react";
import NavigationBar from "../../Components/Layouts/NavigationBar";
import SideBar from "../../Components/Layouts/SideBar";
import "./Dashboard.css";
import IconPhArchiveBoxFill from "../../Assets/Icon/IconPhArchiveBoxFill.tsx";
// import IconArrowBackward from "../../Assets/Icon/IconArrowBackward.tsx";
// import '../../Assets/Icon/IconPhArchiveBoxFill.tsx';
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
                  <div className="bigCard card slight-gold">
                    <div className="bIcon-container">
                      <IconPhArchiveBoxFill className="bIcon"/>  
                    </div>
                    <p style={{ fontSize: "25px" }}>
                      Total Chemicals in Stock
                    </p>
                    <h4 style={{ fontSize: "45px" }}>250</h4>
                  </div>
                  <div className="smallCards">
                    <div className="card slight-purple">
                      <div className="icon-container purple">
                        <IconPhArchiveBoxFill className="icon"/>  
                      </div>
                      <p>
                        Pending Chemical Requests
                      </p>
                      <h4>15</h4>
                    </div>
                    <div className="card slight-red">
                      <div className="icon-container red">
                        <IconPhArchiveBoxFill className="icon"/>  
                      </div>
                      <p>
                        Chemicals Near Expiry
                      </p>
                      <h4>20</h4>
                    </div>
                    <div className="card slight-green">
                      <div className="icon-container green">
                        <IconPhArchiveBoxFill className="icon"/>  
                      </div>
                      <p>
                        Storage Locations with No Remaining Capacity
                      </p>
                      <h4>3</h4>
                    </div>
                    <div className="card slight-grey">
                      <div className="icon-container grey">
                        <IconPhArchiveBoxFill className="icon"/>  
                      </div>
                      <p>
                        Most Frequently Ordered Chemical
                      </p>
                      <h4>Ethanol (10/month)</h4>
                    </div>
                  </div>
                </div>
                <div className="card slight-pink">
                  <div className="icon-container pink">
                      <IconPhArchiveBoxFill className="icon"/>  
                  </div>
                  <p>
                    Disposals Completed in the Last 30 Days
                  </p>
                  <h4>12</h4>
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
