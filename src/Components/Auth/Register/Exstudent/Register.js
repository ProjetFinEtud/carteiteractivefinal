import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Activite from "./Activite";
import Localisation from "./Localisation";
import Review from "./Review";
import Poste from "./Poste";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Information from "./Information";

const steps = ["Informations", "Activité", "Localisation", "Poste", "Résumé"];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    master: "",
    annee: "",
    domaine: "",
    laltitude: "",
    longitude: "",
    nom_poste: "",
    nom_entreprise: "",
    description: "",
    annee_debut: "",
    annee_fin: "",
  });

  const [formDataShow, setFormDataShow] = useState({
    nom: "",
    prenom: "",
    email: "",
    master: "",
    annee: "",
    domaine: "",
    localisation: "",
    nom_poste: "",
    nom_entreprise: "",
    description: "",
    annee_debut: "",
    annee_fin: "",
  });

  const [errorsInformation, setErrorsInformation] = useState({
    nom: "",
    prenom: "",
    email: "",
    master: "",
    annee: "",
  });

  const [errorsActivite, setErrorsActivite] = useState({
    master: "",
    annee: "",
    domaine: "",
  });

  const [errorsLocalisation, setErrorsLocalisation] = useState({
    localisation: "",
  });

  const [errorsPoste, setErrorsPoste] = useState("");

  const [errors, setErrors] = useState({
    validation: "",
  });

  const [validationSuccess, setValidationSuccess] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    const newErrorsInformation = { ...errorsInformation };
    const newErrorsActivite = { ...errorsActivite };
    const newErrorsLocalisation = { ...errorsLocalisation };

    if (
      activeStep === 0 &&
      (!formData.nom || !formData.prenom || !formData.email)
    ) {
      if (!formData.nom) {
        newErrorsInformation.nom = "Veuillez entrer votre nom";
      } else {
        newErrorsInformation.nom = "";
      }

      if (!formData.prenom) {
        newErrorsInformation.prenom = "Veuillez entrer votre prénom";
      } else {
        newErrorsInformation.prenom = "";
      }

      if (!formData.email) {
        newErrorsInformation.email = "Veuillez entrer votre email (valide)";
      } else {
        newErrorsInformation.email = "";
      }

      setErrorsInformation(newErrorsInformation);
      return;
    }

    if (activeStep === 2 && (!formData.laltitude || !formData.longitude)) {
      if (!formData.longitude || !formData.laltitude) {
        newErrorsLocalisation.localisation =
          "Veuillez marquer votre emplacement sur la carte";
      } else {
        newErrorsLocalisation.localisation = "";
      }

      setErrorsLocalisation(newErrorsLocalisation);
      return;
    }

    if (activeStep === 3 && !formData.nom_poste) {
      setErrorsPoste("Veuillez sélectionner un poste ou Pas de poste");
      return;
    }

    if (
      activeStep === 1 &&
      (!formData.master || !formData.annee || !formData.domaine)
    ) {
      if (!formData.master) {
        newErrorsActivite.master = "Veuillez sélectionner votre master";
      } else {
        newErrorsActivite.master = "";
      }

      if (!formData.domaine) {
        newErrorsActivite.domaine = "Veuillez sélectionner votre domaine";
      } else {
        newErrorsActivite.domaine = "";
      }

      if (!formData.annee) {
        newErrorsActivite.annee = "Veuillez sélectionner votre année";
      } else {
        newErrorsActivite.annee = "";
      }

      setErrorsActivite(newErrorsActivite);
      return;
    }

    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleFormDataChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors((prevData) => ({ ...prevData, validation: "" }));
  };

  const handleFormDataChangeShow = (field, value) => {
    setFormDataShow({ ...formDataShow, [field]: value });
  };

  const handleFormDataLon = (field, value) => {
    setErrorsLocalisation({ ...errorsLocalisation, [field]: "" });
    formData.longitude = value;
  };

  const handleFormDataLat = (field, value) => {
    setErrorsLocalisation({ ...errorsLocalisation, [field]: "" });
    formData.laltitude = value;
  };

  const handleValidation = async (event) => {
    event.preventDefault();

    const apiResponse = await fetch("/server/auth/createxStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

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

    setActiveStep(steps.length);

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Box
          sx={{
            maxHeight: "90vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            <Typography component="h1" variant="h4" align="center">
              <em>Rejoignez-nous</em>
            </Typography>
            <Form.Text className="text-danger">{errors.validation}</Form.Text>
            <Stepper
              activeStep={activeStep}
              sx={{ pt: 3, pb: 5, marginLeft: "auto", marginRight: "auto" }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              { validationSuccess } && (
                <Form.Text className="text-success">
                  Félicitations ! Votre compte est désormais en attente de
                  validation. Vous recevrez un email dès que votre compte sera
                  activé. N'hésitez pas à consulter également vos de spams.
                </Form.Text>
              )
            ) : (
              <React.Fragment>
                {activeStep === 0 && (
                  <Information
                    onFieldChange={handleFormDataChange}
                    onFieldChangeShow={handleFormDataChangeShow}
                    formData={formData}
                    errors={errorsInformation}
                    setErrors={setErrorsInformation}
                  />
                )}
                {activeStep === 1 && (
                  <Activite
                    onFieldChange={handleFormDataChange}
                    onFieldChangeShow={handleFormDataChangeShow}
                    formData={formData}
                    errors={errorsActivite}
                    setErrors={setErrorsActivite}
                  />
                )}
                {activeStep === 2 && (
                  <Localisation
                    onFieldChangeLon={handleFormDataLon}
                    onFieldChangeShow={handleFormDataChangeShow}
                    onFieldChangeLat={handleFormDataLat}
                    formData={formData}
                    errors={errorsLocalisation}
                  />
                )}
                {activeStep === 3 && (
                  <Poste
                    formData={formData}
                    onFieldChangeShow={handleFormDataChangeShow}
                    onFieldChange={handleFormDataChange}
                    errors={errorsPoste}
                    setErrors={setErrorsPoste}
                  />
                )}
                {activeStep === 4 && <Review formData={formDataShow} />}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Précédent
                    </Button>
                  )}
                  {activeStep !== steps.length - 1 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 3, ml: 1 }}
                    >
                      Suivant
                    </Button>
                  )}
                  {activeStep === steps.length - 1 && (
                    <Button
                      variant="contained"
                      onClick={handleValidation}
                      sx={{ mt: 3, ml: 1 }}
                    >
                      Valider
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Paper>
        </Box>
      </Container>
    </React.Fragment>
  );
}
