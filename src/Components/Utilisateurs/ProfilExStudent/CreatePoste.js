import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from '@mui/material/MenuItem';

const Poste = () => {
  const [formData, setFormData] = useState({
    nomPoste: "",
    descriptionPoste: "",
    nomEntreprise: "",
    dateDebut: "",
    dateFin: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [postes, setPostes] = useState([]);

  useEffect(() => {
    const fetchPostes = async () => {
      try {
        const response = await fetch("server/allPrePostes");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des postes.");
        }
        const data = await response.json();
        setPostes(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPostes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setSuccess("");
    setError("");
  };

  const handleCreatePoste = async () => {
    if (
      !formData.nomPoste ||
      !formData.descriptionPoste ||
      !formData.nomEntreprise ||
      !formData.dateDebut ||
      !formData.dateFin
    ) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("server/user/createposte", {
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
      }

      setSuccess("Votre poste a été ajouté avec succès");

      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.8)", maxWidth: "400px" }}>
      <TextField
        select
        label="Nom du poste"
        name="nomPoste"
        value={formData.nomPoste}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {postes.map((poste) => (
          <MenuItem key={poste.id} value={poste.id}>
            {poste.nom}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Description du poste"
        name="descriptionPoste"
        value={formData.descriptionPoste}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nom de l'entreprise"
        name="nomEntreprise"
        value={formData.nomEntreprise}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date de début"
        type="date"
        name="dateDebut"
        value={formData.dateDebut}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Date de fin"
        type="date"
        name="dateFin"
        value={formData.dateFin}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePoste}
      >
        Créer le poste
      </Button>
    </div>
  );
};

export default Poste;
