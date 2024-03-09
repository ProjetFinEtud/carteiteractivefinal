import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [success, setSucess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
    setSucess("");
  };

  const handleCreateAdmin = async () => {
    // Valider les champs du formulaire
    if (!formData.firstName || !formData.lastName) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Envoyer les données au serveur pour créer un nouvel administrateur
      const response = await fetch("/user/createadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      } else {
        setSucess("Nouvel administrateur créé avec succès !");
        // Réinitialiser les champs du formulaire après la création réussie
        setFormData({
          firstName: "",
          lastName: "",
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      style={{ padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.8)" }}
    >
      <TextField
        label="Prénom"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nom"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateAdmin}
      >
        Créer un administrateur
      </Button>
    </div>
  );
};

export default CreateAdmin;
