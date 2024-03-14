import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authSession, setAuthSession] = useState(false);
  const [pageAccess, setPageAccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/server/auth/verifAuth", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });

        if (response.status === 202) {
          setAuthSession(true);
          setPageAccess("dashbordAdmin");
        } else if (response.status === 203) {
          setAuthSession(true);
          setPageAccess("dashbordExstudent");
        } else if (response.status === 204) {
          setAuthSession(true);
          setPageAccess("dashbordStudent");
        } else {
          setAuthSession(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ authSession, pageAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
