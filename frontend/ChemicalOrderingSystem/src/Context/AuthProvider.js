import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Attempt to retrieve the auth state from localStorage (or sessionStorage)
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false };
  });

  // Effect to update localStorage whenever the auth state changes
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // Method to log in
  const login = (authData, userRole) => {
    setAuth({ ...authData, isAuthenticated: true });
    if (userRole) {
      localStorage.setItem("userRole", userRole); // Store entire userRole array
    }
  };

  // Method to log out
  const logout = () => {
    setAuth({ isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
