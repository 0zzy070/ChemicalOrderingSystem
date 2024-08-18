import NavigationBar from "../Components/Layouts/NavigationBar";

const DefaultLayout = () => {
  return (
    <div>
      <header>
        <NavigationBar></NavigationBar>
      </header>

      <main>
        {/* This will render the child components (the routed pages) */}
      </main>

      <footer className="footer">
        <span className="text-muted small">Powered by Okta</span>
        <a href="#privacy-policy" className="text-muted small">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
};

export default DefaultLayout;
