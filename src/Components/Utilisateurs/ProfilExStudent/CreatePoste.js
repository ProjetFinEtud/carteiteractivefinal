import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Poste = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomPoste: "",
    descriptionPoste: "",
    nomEntreprise: "",
    dateDebut: "",
    dateFin: "",
  });
  const [error, setError] = useState("");
  const [success, setSucess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setSucess("")
    setError("")
  };

  const handleCreatePoste = async () => {
    // Valider les champs du formulaire
    if (!formData.nomPoste || !formData.descriptionPoste || !formData.nomEntreprise || !formData.dateDebut || !formData.dateFin) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Appeler l'API pour créer le poste
    try {
      const response = await fetch("/user/createposte", {
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

      setSucess("Votre poste a été ajouter avec succès")

      // Poste créé avec succès
      window.location.reload(); // Remplacer "/success" par l'URL de la page de succès
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
      <TextField
        label="Nom du poste"
        name="nomPoste"
        value={formData.nomPoste}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
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
