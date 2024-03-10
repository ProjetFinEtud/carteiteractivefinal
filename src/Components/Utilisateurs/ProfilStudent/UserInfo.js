import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
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
      const response = await fetch("/server/user/infoStudent", {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const jsonData = await response.json();
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
      <TextField
        label="Nom"
        value={userData.stu_nom}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Prénom"
        value={userData.stu_prenom}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Adresse email"
        value={userData.stu_email}
        fullWidth
        margin="normal"
      />
    </div>
  );
};

export default UserInfo;
