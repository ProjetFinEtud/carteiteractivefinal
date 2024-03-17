import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authSession, setAuthSession] = useState(false);
  const [authAdmin, setAuthAdmin] = useState(false);
  const [authExs, setAuthExs] = useState(false);
  const [authStu, setAuthStu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await fetch("/server/auth/verifAuth", {
        const response = await fetch("/auth/verifAuth", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });

        if (response.status === 202) {
          setAuthSession(true);
          setAuthAdmin(true)
        } else if (response.status === 203) {
          setAuthSession(true);
          setAuthExs(true)
        } else if (response.status === 204) {
          setAuthSession(true);
          setAuthStu(true)
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
    <AuthContext.Provider value={{ authSession, authAdmin, authExs, authStu }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
