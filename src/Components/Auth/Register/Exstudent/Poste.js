import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import FormControl from "@mui/material/FormControl";
export default function Poste({
  onFieldChange,
  onFieldChangeShow,
  formData,
  errors,
  setErrors,
}) {
  const [nom_poste, setNom_poste] = useState(formData.nom_poste || "");
  const [nom_entreprise, setNom_entreprise] = useState(
    formData.nom_entreprise || ""
  );
  const [description, setDescription] = useState(formData.description || "");
  const [selectedAnnee_debut, setSelectedAnnee_debut] = useState("");
  const [selectedAnnee_fin, setSelectedAnnee_fin] = useState("");
  const [dataPoste, setDataPoste] = useState([]);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 30; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const years = generateYears();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/server/auth/allPostes");
        const responseJson = await response.json();
        setDataPoste(
          responseJson.postes.map((item) => ({
            pre_id: item.pre_id,
            pre_nom: item.pre_nom,
          }))
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des postes :", error);
      }
    };
    fetchData();
  }, []);

  const handleAnneeDebutChange = (event) => {
    const selectedAnneeValue = event.target.value;
    setSelectedAnnee_debut(selectedAnneeValue);
    onFieldChange("annee_debut", selectedAnneeValue);
    onFieldChangeShow("annee_debut", selectedAnneeValue);
    setErrors("");
  };

  const handleAnneeFinChange = (event) => {
    const selectedAnneeValue = event.target.value;
    setSelectedAnnee_fin(selectedAnneeValue);
    onFieldChange("annee_fin", selectedAnneeValue);
    onFieldChangeShow("annee_fin", selectedAnneeValue);
    setErrors("");
  };

  const handleNomPosteChange = (event) => {
    const value = event.target.value;
    setNom_poste(value);
    onFieldChange("nom_poste", value);
    onFieldChangeShow(
      "nom_poste",
      dataPoste.find((item) => item.pre_id === value)?.pre_nom || ""
    );
    setErrors("");
  };

  const handleNomEntrepriseChange = (event) => {
    const value = event.target.value;
    setNom_entreprise(value);
    onFieldChange("nom_entreprise", value);
    onFieldChangeShow("nom_entreprise", value);
    setErrors("");
  };

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    setDescription(value);
    onFieldChange("description", value);
    onFieldChangeShow("description", value);
    setErrors("");
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Détails sur votre poste actuel
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <InputLabel>Votre dernier poste en date</InputLabel>
          <Select
            labelId="nom_poste"
            id="pos_id"
            value={nom_poste}
            onChange={handleNomPosteChange}
          >
            {dataPoste.map((item) => (
              <MenuItem key={item.pre_nom} value={item.pre_id}>
                {item.pre_nom}
              </MenuItem>
            ))}
          </Select>
          {errors && (
            <div variant="h6" style={{ color: "red", marginBottom: "20px" }}>
              {errors}
            </div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Nom de votre entreprise actuelle</InputLabel>
          <TextField
            id="nom_entreprise"
            name="nom_entreprise"
            label="Nom de l'entreprise"
            fullWidth
            autoComplete="family-name"
            value={nom_entreprise}
            onChange={handleNomEntrepriseChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>
            Description de vos principales missions sur ce poste
          </InputLabel>
          <TextField
            id="description"
            name="description"
            label="Description"
            fullWidth
            autoComplete="description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Début</InputLabel>
          <Select
            labelId="annee_debut"
            id="annee_debut"
            value={selectedAnnee_debut}
            onChange={handleAnneeDebutChange}
          >
            {years.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ display: "flex", alignItems: "center" }}>
            <InputLabel htmlFor="annee_fin">Fin</InputLabel>
            <Select
              labelId="annee_fin_label"
              id="annee_fin"
              value={selectedAnnee_fin}
              onChange={handleAnneeFinChange}
              inputProps={{
                name: "annee_fin",
                id: "annee_fin",
              }}
            >
              {years.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title="Vous pouvez laisser ce champ vide si cela est votre poste actuel">
              <IconButton aria-label="info">
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </FormControl>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
