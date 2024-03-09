import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    exs_nom: "",
    exs_prenom: "",
    exs_photo: "",
    exs_email: "",
    exs_description: "",
  });
  const [newAvatar, setNewAvatar] = useState(null); // Nouvelle image sélectionnée

  // Fonction pour récupérer les données de l'utilisateur depuis l'API
  const fetchUserData = async () => {
    try {
      const response = await fetch("/user/info", {
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

  // Fonction pour mettre à jour les données utilisateur modifiées et les envoyer à l'API
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("exs_photo", newAvatar); // Ajouter la nouvelle image au FormData
      formData.append("exs_nom", userData.exs_nom);
      formData.append("exs_prenom", userData.exs_prenom);
      formData.append("exs_email", userData.exs_email);
      formData.append("exs_description", userData.exs_description);

      const response = await fetch("/user/updateinfo", {
        method: "PUT",
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des données");
      }
      alert("Données mises à jour avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des données:",
        error.message
      );
      setError(error.message);
    }
  };

  // Fonction pour gérer le chargement de la nouvelle image sélectionnée
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
  };

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
      <div>
        <Avatar
          alt="Avatar"
          src={"/images/" + userData.exs_photo}
          sx={{ width: 100, height: 100, margin: "10px" }}
        />
        <Button variant="contained" component="label">
          Modifier votre image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Button>
      </div>
      <TextField
        label="Nom"
        value={userData.exs_nom}
        onChange={(e) => setUserData({ ...userData, exs_nom: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Prénom"
        value={userData.exs_prenom}
        onChange={(e) =>
          setUserData({ ...userData, exs_prenom: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Adresse email"
        value={userData.exs_email}
        onChange={(e) =>
          setUserData({ ...userData, exs_email: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={userData.exs_description}
        onChange={(e) =>
          setUserData({ ...userData, exs_description: e.target.value })
        }
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Enregistrer
      </Button>
    </div>
  );
};

export default UserInfo;
