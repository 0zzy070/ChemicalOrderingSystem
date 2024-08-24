import NavigationBar from "../Components/Layouts/NavigationBar";
import SideBar from "../Components/Layouts/SideBar";

const DefaultLayout = () => {
  return (
    <div>
      <NavigationBar></NavigationBar>

      <main>
        <SideBar></SideBar>
      </main>
    </div>
  );
};

export default DefaultLayout;
