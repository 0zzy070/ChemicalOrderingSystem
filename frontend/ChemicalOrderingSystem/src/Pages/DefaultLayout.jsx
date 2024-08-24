import NavigationBar from "../Components/Layouts/NavigationBar";
import SideBar from "../Components/Layouts/SideBar";
import "./DefaultDashboard.css"

const DefaultLayout = () => {
  return (
    <div>
      <NavigationBar></NavigationBar>

      <main>
        <SideBar></SideBar>
        <div className="default-dashboard">
          <div className="title"><h3>Welcome to our System!</h3></div>
          <div className="cards">
              <div className="bigCard card">
                <h4>Users</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam rerum nemo modi a exercitationem necessitatibus</p>
              </div>
              <div className="smallCards">
                <div className="card">
                  <h4>Users</h4>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam rerum nemo modi a exercitationem necessitatibus</p>
                </div>
                <div className="card">
                  <h4>Total chemicals</h4>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam rerum nemo modi a exercitationem necessitatibus</p>
                </div>
                <div className="card">
                  <h4>Approvals</h4>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam rerum nemo modi a exercitationem necessitatibus</p>
                </div>
                <div className="card">
                  <h4>Pending orders</h4>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam rerum nemo modi a exercitationem necessitatibus</p>
                </div>
              </div>
              
          </div>
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
