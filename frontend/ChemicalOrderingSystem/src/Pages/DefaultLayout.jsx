import NavigationBar from "../Components/Layouts/NavigationBar";
import SideBar from "../Components/Layouts/SideBar";

const DefaultLayout = () => {
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
              <div className="container-fluid">Hello</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
