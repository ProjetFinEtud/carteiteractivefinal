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


  // Fonction pour récupérer les données de l'utilisateur depuis l'API
  const fetchUserData = async () => {
    try {
      const response = await fetch("/user/infoAdmin", {
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

  // Fonction pour mettre à jour les données utilisateur modifiées et les envoyer à l'API

  // Affichage d'un indicateur de chargement pendant le chargement des données
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
