import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

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
      setError(null); // Réinitialiser l'erreur après la mise à jour réussie
      setSuccessMessage("Données mises à jour avec succès !");
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
    setError(null); // Effacer l'erreur lorsqu'un champ est modifié
    setSuccessMessage(null); // Effacer le message de succès lorsqu'un champ est modifié
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Informations personnelles
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} align="center">
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nom"
              value={userData.exs_nom}
              onChange={(e) => handleInputChange("exs_nom", e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Prénom"
              value={userData.exs_prenom}
              onChange={(e) => handleInputChange("exs_prenom", e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Adresse email"
              value={userData.exs_email}
              onChange={(e) => handleInputChange("exs_email", e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={userData.exs_description}
              onChange={(e) => handleInputChange("exs_description", e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} align="center">
            {error && <Typography variant="body1" color="error">{error}</Typography>}
            {successMessage && <Typography variant="body1" color="success">{successMessage}</Typography>}
            <Button variant="contained" color="primary" onClick={handleSave}>
              Enregistrer
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserInfo;
