import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Link } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();
  const [validationSuccess, setValidationSuccess] = useState(false);
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 2; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const years = generateYears();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    master: "",
    annee: "",
  });
  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    master: "",
    annee: "",
    validation: "",
    politique: "",
  });
  const [checked, setChecked] = useState(false);

  const validateForm = () => {
    const newErrors = { ...errors };
    if (!formData.nom) {
      newErrors.nom = "Veuillez entrer votre nom";
    } else {
      newErrors.nom = "";
    }

    if (!formData.prenom) {
      newErrors.prenom = "Veuillez entrer votre prénom";
    } else {
      newErrors.prenom = "";
    }

    if (!formData.email) {
      newErrors.email = "Veuillez entrer votre email";
    } else {
      newErrors.email = "";
    }

    if (!formData.email || !formData.email.includes("@etudiant.univ")) {
      newErrors.email = "Veuillez entrer votre email étudiant";
    } else {
      newErrors.email = "";
    }

    if (!formData.master) {
      newErrors.master = "Veuillez sélectionné un diplôme";
    } else {
      newErrors.master = "";
    }

    if (!formData.annee) {
      newErrors.annee = "Veuillez sélectionné une année";
    } else {
      newErrors.annee = "";
    }
    if (!checked) {
      newErrors.politique = "Veuillez cochez la politique d'utilisation";
    }
    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const [loading, setLoading] = useState(true);
  const [masterOptions, setMasterOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseMaster = await fetch(
          "/server/auth/allMaster"
        );
        const jsonData = await responseMaster.json();
        const newData = jsonData.columns.map((item) => ({
          mas_id: item.mas_id,
          mas_nom: item.mas_nom,
        }));

        setMasterOptions(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setErrors((prevData) => ({ ...prevData, [field]: "" }));
    setErrors((prevData) => ({ ...prevData, validation: "" }));
  };

  const handleValidation = async (event) => {
    event.preventDefault();

    const formIsValid = validateForm();
    if (!formIsValid) {
      return;
    } else {
      const apiResponse = await fetch(
        "/server/auth/createstudent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!apiResponse.ok) {
        if (apiResponse.status === 400) {
          setErrors((prevData) => ({
            ...prevData,
            validation: "Vous êtes déjà inscrit",
          }));
        } else {
          setErrors((prevData) => ({
            ...prevData,
            validation: "Veuillez réessayer ultérieurement",
          }));
        }
        return;
      } else {
        setValidationSuccess(true);
      }
    }
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!masterOptions) {
    return <div>Error fetching data</div>;
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setErrors((prevData) => ({
      ...prevData,
      politique: "",
    }));
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
            <em>Rejoingnez nous</em>
          </Typography>
          <Typography component="h1" variant="h5" align="center">
            <Form.Text className="text-danger">{errors.validation}</Form.Text>
            {validationSuccess && (
              <Form.Text className="text-success">
                Félicitations ! Votre compte est désormais en attente de
                validation. Vous recevrez un email dès que votre compte sera
                activé. N'hésitez pas à consulter également vos de spams.
              </Form.Text>
            )}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="nom"
                name="nom"
                label="Nom"
                fullWidth
                autoComplete="given-name"
                value={formData.nom}
                onChange={(event) =>
                  handleFieldChange("nom", event.target.value)
                }
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
                value={formData.prenom}
                onChange={(event) =>
                  handleFieldChange("prenom", event.target.value)
                }
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
                value={formData.email}
                onChange={(event) =>
                  handleFieldChange("email", event.target.value)
                }
              />
              <Form.Text className="text-danger">{errors.email}</Form.Text>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel id="master">Master</InputLabel>
              <Select
                labelId="master"
                id="master"
                value={formData.master}
                label="Master"
                onChange={(event) =>
                  handleFieldChange("master", event.target.value)
                }
              >
                <MenuItem value="">Choisissez votre master</MenuItem>
                {masterOptions.map((item) => (
                  <MenuItem key={item.mas_id} value={item.mas_id}>
                    <em>{item.mas_nom}</em>
                  </MenuItem>
                ))}
              </Select>
              <Form.Text className="text-danger">{errors.master}</Form.Text>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel id="annee">Promotion</InputLabel>
              <Select
                labelId="annee"
                id="annee"
                value={formData.annee}
                label="annee"
                onChange={(event) =>
                  handleFieldChange("annee", event.target.value)
                }
              >
                {years.map((item) => (
                  <MenuItem key={item} value={item}>
                    <em>{item}</em>
                  </MenuItem>
                ))}
              </Select>
              <Form.Text className="text-danger">{errors.annee}</Form.Text>
            </Grid>
          </Grid>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChange} />}
          />
          <Link to="/politique">Voir la politique de confidentialité</Link>
          <Form.Text className="text-danger">{errors.politique}</Form.Text>
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
