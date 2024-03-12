import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Form } from "react-bootstrap";

export default function Information({ onFieldChange, onFieldChangeShow, formData, errors, setErrors }) {
  const [nom, setNom] = useState(formData.nom || '');
  const [prenom, setPrenom] = useState(formData.prenom || '');
  const [email, setEmail] = useState(formData.email || '');

  const handleNomChange = (event) => {
    const value = event.target.value;
    setNom(value);
    setErrors({ ...errors, nom: "" });
    onFieldChange('nom', value);
    onFieldChangeShow('nom', value);
  };

  const handlePrenomChange = (event) => {
    const value = event.target.value;
    setPrenom(value);
    setErrors({ ...errors, prenom: "" });
    onFieldChange('prenom', value);
    onFieldChangeShow('prenom', value);
  };

  const handleEmailChange = (event) => {
    var value = event.target.value;
    setEmail(value);
    setErrors({ ...errors, email: "" });
    const regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
    if(regex.test(email)){
      value = ""  
    }
    onFieldChange('email', value);
    onFieldChangeShow('email', value);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Informations
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="nom"
            name="nom"
            label="Nom"
            fullWidth
            autoComplete="given-name"
            value={nom}
            onChange={handleNomChange}
          />
          <Form.Text className="text-danger">{errors.nom}</Form.Text>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="prenom"
            name="prenom"
            label="Prénom"
            fullWidth
            autoComplete="family-name"
            value={prenom}
            onChange={handlePrenomChange}
          />
          <Form.Text className="text-danger">{errors.prenom}</Form.Text>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="email"
            name="email"
            label="Adresse mail"
            fullWidth
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
          />
          <Form.Text className="text-danger">{errors.email}</Form.Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
