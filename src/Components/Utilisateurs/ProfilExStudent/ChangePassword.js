import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSucess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("")
    setSucess("")
  };

  const handleChangePassword = async () => {
    // Valider les champs du formulaire
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.newPassword.length < 7) {
      setError("Le nouveau mot de passe doit comporter au moins 7 caractères.");
      return;
    }


    try {
     // const response = await fetch("/server/user/updatexspass", {
      const response = await fetch("/user/updatexspass", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }else{
        setSucess("Votre mot de passe à été mis à jours");
        window.location.reload();
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
        label="Mot de passe actuel"
        type="password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nouveau mot de passe"
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirmer le nouveau mot de passe"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleChangePassword}
      >
        Changer le mot de passe
      </Button>
    </div>
  );
};

export default ChangePassword;
