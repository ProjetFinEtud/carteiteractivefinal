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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleSendEmail = async () => {
    if (!email) {
      setError("Veuillez entrer votre adresse e-mail.");
      return;
    }
    try {
      const response = await fetch("/server/auth/resetpassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

     if (!response.ok) {
      
        if(response.status === 400) {
          setError("Veuillez saisir votre adresse email d'inscription.");
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
        navigate("/connexion")
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            <em>Mot de passe oublié</em>
          </Typography>
          <Typography component="h1" variant="h5" align="center">
            {success && (
              <Form.Text className="text-success">Un e-mail de réinitialisation de mot de passe a été envoyé à {email}.</Form.Text>
            )}
            {error && (
              <Form.Text className="text-danger">{error}</Form.Text>
            )}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="email"
                name="email"
                label="Adresse e-mail"
                fullWidth
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
              />
              <Form.Text className="text-danger"></Form.Text>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendEmail}
            >
              Envoyer l'e-mail de réinitialisation
            </Button>
          </Grid>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
