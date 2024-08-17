import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Authentication/Login";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
