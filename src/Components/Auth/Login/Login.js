import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    validation: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = { ...errors };
    if (!formData.username) {
      newErrors.username = "Veuillez entrer votre nom";
    } else {
      newErrors.username = "";
    }

    if (!formData.password) {
      newErrors.password = "Veuillez entrer votre prénom";
    } else {
      newErrors.password = "";
    }

    newErrors.validation = "";

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setErrors((prevData) => ({ ...prevData, [field]: "" }));
    setErrors((prevData) => ({ ...prevData, validation: "" }));
  };

  const handleValidation = async () => {
    const formIsValid = validateForm();
    if (!formIsValid) {
      return;
    } else {
      const apiResponse = await fetch("/server/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!apiResponse.ok) {
        if (apiResponse.status === 401) {
          setErrors((prevData) => ({
            ...prevData,
            validation: "Identifiant ou mot de passe incorrect",
          }));
        } else {
          setErrors((prevData) => ({
            ...prevData,
            validation: "Veuillez réessayer ultérieurement",
          }));
        }
        return;
      } else {
        const data = await apiResponse.json();
        sessionStorage.setItem("accessToken", data.token);
        if (apiResponse.status === 201) {
          navigate("/updatepass");
        } else {
          navigate("/dashbordAdmin");
          //window.location.reload();
        }
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4, paddingTop:"70px" }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            <em>Connectez vous à la carte itéractive</em>
          </Typography>
          <Typography component="h1" variant="h5" align="center">
            <Form.Text className="text-danger">{errors.validation}</Form.Text>
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="username"
                name="username"
                label="nom d'utilisateur"
                fullWidth
                autoComplete="given-name"
                value={formData.username}
                onChange={(event) =>
                  handleFieldChange("username", event.target.value)
                }
              />
              <Form.Text className="text-danger">{errors.nom}</Form.Text>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                id="password"
                name="password"
                label="mot de passe"
                fullWidth
                autoComplete="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(event) =>
                  handleFieldChange("password", event.target.value)
                }
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />

              <Form.Text className="text-danger">{errors.password}</Form.Text>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end" sx={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleValidation}
            >
              Valider
            </Button>
          </Grid>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleForgotPassword}
          >
            Mot de passe oublié ?
          </Button>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
