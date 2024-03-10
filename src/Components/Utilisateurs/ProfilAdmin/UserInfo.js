import React, { useState, useEffect } from "react";

import CircularProgress from "@mui/material/CircularProgress";

const UserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    stu_nom: "",
    stu_prenom: "",
    stu_email: "",
  });


  const fetchUserData = async () => {
    try {
      const response = await fetch("/server/user/infoAdmin", {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const jsonData = await response.json();
      console.log(jsonData);
      setUserData(jsonData);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données:",
        error.message
      );
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div
      style={{ padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.8)" }}
    >
      Bienvenue{" "}
      {userData.adm_nom.charAt(0).toUpperCase() +
        userData.adm_nom.slice(1) +
        " " +
        userData.adm_prenom.charAt(0).toUpperCase() +
        userData.adm_prenom.slice(1)}
    </div>
  );
};

export default UserInfo;
