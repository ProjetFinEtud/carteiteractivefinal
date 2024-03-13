import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

const UserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userData, setUserData] = useState({
    exs_nom: "",
    exs_prenom: "",
    exs_photo: "",
    exs_email: "",
    exs_description: "",
  });
  const [newAvatar, setNewAvatar] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/server/user/info", {
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
    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      if (!userData.exs_nom || !userData.exs_prenom || !userData.exs_email) {
        throw new Error("Veuillez remplir tous les champs");
      }

      const formData = new FormData();
      formData.append("exs_photo", newAvatar);
      formData.append("exs_nom", userData.exs_nom);
      formData.append("exs_prenom", userData.exs_prenom);
      formData.append("exs_email", userData.exs_email);
      formData.append("exs_description", userData.exs_description);

      const response = await fetch("/server/user/updateinfo", {
        method: "PUT",
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des données");
      }
      setError(null); 
      setSuccessMessage("Données mises à jour avec succès !");
      window.location.reload();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des données:",
        error.message
      );
      setError(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
  };

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
    setError(null); 
    setSuccessMessage(null); 
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div
    style={{
      padding: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      maxWidth: "400px",
      margin: "auto",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
      <Avatar
        alt="Avatar"
        src={"server/images/" + userData.exs_photo}
        sx={{ width: 100, height: 100, marginRight: "10px" }}
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
    <div style={{ display: "flex", marginBottom: "10px" }}>
      <TextField
        label="Nom"
        value={userData.exs_nom}
        onChange={(e) => handleInputChange("exs_nom", e.target.value)}
        fullWidth
        margin="normal"
        style={{ marginRight: "10px" }}
      />
      <TextField
        label="Prénom"
        value={userData.exs_prenom}
        onChange={(e) => handleInputChange("exs_prenom", e.target.value)}
        fullWidth
        margin="normal"
      />
    </div>
    <TextField
      label="Adresse email"
      value={userData.exs_email}
      onChange={(e) => handleInputChange("exs_email", e.target.value)}
      fullWidth
      margin="normal"
      style={{ marginBottom: "10px" }}
    />
    <TextField
      label="Description"
      value={userData.exs_description}
      onChange={(e) => handleInputChange("exs_description", e.target.value)}
      fullWidth
      margin="normal"
      multiline
      rows={4}
      style={{ marginBottom: "10px" }}
    />
    {error && <p style={{ color: "red" }}>{error}</p>}
    {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    <Button variant="contained" color="primary" onClick={handleSave}>
      Enregistrer
    </Button>
  </div>
  );
};

export default UserInfo;
