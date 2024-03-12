import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Update() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    newpassword: "",
    confirmpass: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    newpassword: "",
    confirmpass:"",
  });
  const [validation, setValidation] = useState("")

  const validateForm = () => {
    const newErrors = { ...errors };
    if (!formData.username) {
      newErrors.username = "Veuillez entrer votre nom d'utilisateur";
    } else {
      newErrors.username = "";
    }


    if (!formData.password) {
      newErrors.password = "Veuillez entrer votre mot le mot de passe reçu";
    } else {
      newErrors.password = "";
    }
    if (!formData.newpassword) {
      newErrors.newpassword = "Veuillez entrer votre nouveau mot le mot de passe";
    } else {
      newErrors.newpassword = "";
    }
    
    if (!formData.confirmpass) {
      newErrors.confirmpass = "Veuillez confirmer votre mot de passe";
    } else {
      newErrors.confirmpass = "";
    }
    if (formData.newpassword !== formData.confirmpass) {
      newErrors.newpassword("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.newpassword.length < 7) {
      newErrors.newpassword("Le nouveau mot de passe doit comporter au moins 7 caractères.");
      return;
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setErrors((prevData) => ({ ...prevData, [field]: "" }));
  };

  const handleValidation = async () => {
    const formIsValid = validateForm();
    console.log(formData)
    if (!formIsValid) {
      console.log("Le formulaire n'est pas valide");
      return;
    } else {
      const apiResponse = await fetch("/server/auth/updatepass", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!apiResponse.ok) {
        if (apiResponse.status === 400) {
          console.error("Erreur de validation des données côté serveur");
        } else if (apiResponse.status === 401) {
          console.error("Erreur d'authentification côté serveur");
        } else {
          console.error("Erreur côté serveur:", apiResponse.statusText);
        }
        return;
      } else {
        const data = await apiResponse.json();
        console.log(data)
        sessionStorage.setItem("accessToken", data.token);
        setValidation("Votre mot de passe à été changer avec succès")
        navigate("/connexion");
      }
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }} style={{ paddingTop:"70px" }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            <em>Personnaliser votre mot de passe</em>
          </Typography>
          <Form.Text className="text-success">{validation}</Form.Text>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="username"
                name="username"
                label="username"
                fullWidth
                autoComplete="given-name"
                value={formData.username}
                onChange={(event) =>
                  handleFieldChange("username", event.target.value)
                }
              />
              <Form.Text className="text-danger">{errors.username}</Form.Text>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                id="password"
                name="password"
                label="password"
                fullWidth
                autoComplete="password"
                type="password"
                value={formData.password}
                onChange={(event) =>
                  handleFieldChange("password", event.target.value)
                }
              />
              <Form.Text className="text-danger">{errors.password}</Form.Text>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                id="newpassword"
                name="newpassword"
                label="newpassword"
                fullWidth
                autoComplete="newpassword"
                type="password"
                value={formData.newpassword}
                onChange={(event) =>
                  handleFieldChange("newpassword", event.target.value)
                }
              />
              <Form.Text className="text-danger">{errors.newpassword}</Form.Text>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                id="confirmpass"
                name="confirmpass"
                label="confirmpass"
                type="password"
                fullWidth
                autoComplete="confirmpass"
                value={formData.confirmpass}
                onChange={(event) =>
                  handleFieldChange("confirmpass", event.target.value)
                }
              />
              <Form.Text className="text-danger">{errors.confirmpass}</Form.Text>
            </Grid>
          </Grid>
          
          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleValidation}
            >
              Valider
            </Button>
          </Grid>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
