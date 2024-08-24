import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";

const Login = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Please login to your account";
  }, []);

  const validate = () => {
    const errors = {};
    if (!formData.userName) {
      errors.userName = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      setTimeout(() => {
        console.log("Form is valid, submit the form", formData);

        // API call goes here
        axios
          .post("/api/users/login", formData)
          .then((response) => {
            // Handle success response
            console.log("Login successful:", response.data);
            navigate("/dashboard");
          })
          .catch((error) => {
            // Handle error response
            if (error.response) {
              // Server responded with a status other than 2xx
              console.error("Error response:", error.response.data);
              setErrors({
                apiError: error.response.data.message || "An error occurred",
              });
            } else if (error.request) {
              // Request was made but no response received
              console.error("No response:", error.request);
              setErrors({
                apiError: "No response from server. Please try again later.",
              });
            } else {
              // Something else happened in setting up the request
              console.error("Error:", error.message);
              setErrors({ apiError: error.message });
            }
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }, 1000);
    }
  };

  return (
    <div>
      <div>
        <header className="bg-light text-center">
          <h4 className="heading">Chemical Ordering System</h4>
          <p>Sign in with your account to access your Dashboard</p>
        </header>
      </div>
      <div className="login-page d-flex justify-content-center align-items-center bg-transparent">
        <div
          className="card p-sm-4 shadow-lg"
          style={{
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <img
            src={require("../../Assets/Images/flinders-logo.png")}
            alt="Flinders University Logo"
            className="mx-auto mb-4"
            style={{
              width: "130px",
              height: "38px",
            }}
          />
          <p className="text-center mb-3">
            Welcome! To obtain access, make sure you have an account created by
            the admins
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group mb-3">
              <label htmlFor="userName" className="fw-bold">
                Username
              </label>
              <input
                type="text"
                id="userName"
                className="form-control"
                placeholder="Username"
                value={formData.userName}
                onChange={handleChange}
              />
              {errors.userName && (
                <small className="text-danger">{errors.userName}</small>
              )}
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="fw-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
              <a href="#forgot-password" className="d-block">
                Forgot your password?
              </a>
            </div>
            <div className="form-check mb-3">
              <input
                type="checkbox"
                id="keep-signed-in"
                className="form-check-input"
              />
              <label htmlFor="keep-signed-in" className="form-check-label">
                Keep me signed in
              </label>
            </div>
            <div className="login-btn">
              <button type="submit" className="btn btn-primary w-100">
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <footer className="footer">
        <span className="text-muted small">Powered by Okta</span>
        <a href="#privacy-policy" className="text-muted small">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
};

export default Login;
