import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Form } from "react-bootstrap";
export default function Activite({ onFieldChange,onFieldChangeShow, formData, errors, setErrors}) {
  const [masterOptions, setMasterOptions] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState("");
  const [domaineOptions, setDomaineOptions] = useState([]);
  const [selectedDomaine, setSelectedDomaine] = useState("");
  const [selectedAnnee, setSelectedAnnee] = useState("");
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
        const responseMaster = await fetch(
          "/server/auth/allMaster"
        );
        const jsonData = await responseMaster.json();
        const newData = jsonData.columns.map((item) => ({
          mas_id: item.mas_id,
          mas_nom: item.mas_nom,
        }));

        setMasterOptions(newData);

        const responseDomaine = await fetch(
          "/server/auth/allDomaine"
        );
        const jsonData2 = await responseDomaine.json();
        const newDataIcone = jsonData2.columns.map((item) => ({
          dom_id: item.dom_id,
          dom_nom: item.dom_nom,
          dom_icone:item.dom_icone
        }));

        setDomaineOptions(newDataIcone);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedMaster(formData.master || "");
    setSelectedDomaine(formData.domaine || "");
    setSelectedAnnee(formData.annee || "");
  }, [formData]);

  const handleMasterChange = (event) => {
    const selectedMasterId = event.target.value;
    setSelectedMaster(selectedMasterId);
    setErrors({ ...errors, master: "" });
    onFieldChange("master", selectedMasterId);
    onFieldChangeShow("master", masterOptions.find(item => item.mas_id === selectedMasterId)?.mas_nom || '');
    
  };

  const handleDomaineChange = (event) => {
    const selectedDomaineId = event.target.value;
    setSelectedDomaine(selectedDomaineId);
    setErrors({ ...errors, domaine: "" });
    onFieldChange("domaine", selectedDomaineId);
    onFieldChangeShow("domaine", domaineOptions.find(item => item.dom_id === selectedDomaineId)?.dom_nom || '');
    
  };

  const handleAnneeChange = (event) => {
    const selectedAnneeValue = event.target.value;
    setSelectedAnnee(selectedAnneeValue);
    setErrors({ ...errors, annee: "" });
    onFieldChange("annee", selectedAnneeValue);
    onFieldChangeShow("annee", selectedAnneeValue);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Education & Domaine d'activité
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InputLabel id="master">Diplôme obtenu</InputLabel>
          <Select
            name="master"
            value={selectedMaster}
            label="Master"
            onChange={handleMasterChange}
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
          <InputLabel id="annee">Année du diplôme</InputLabel>
          <Select
            labelId="annee"
            id="annee"
            value={selectedAnnee} 
            label="annee"
            onChange={handleAnneeChange} 
          >
            {years.map((item) => (
              <MenuItem key={item} value={item}>
                <em>{item}</em>
              </MenuItem>
            ))}
          </Select>
          <Form.Text className="text-danger">{errors.annee}</Form.Text>
        </Grid>
        <Grid item xs={12} md={12}>
          <InputLabel id="domaine">Domaine de votre activité</InputLabel>
          <Select
            labelId="domaine"
            id="domaine"
            value={selectedDomaine}
            label="Domaine"
            onChange={handleDomaineChange}
          >
            {domaineOptions.map((item) => (
              <MenuItem key={item.dom_nom} value={item.dom_id}>
                <em>{item.dom_nom}</em>
              </MenuItem>
            ))}
          </Select>
          <Form.Text className="text-danger">{errors.domaine}</Form.Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
