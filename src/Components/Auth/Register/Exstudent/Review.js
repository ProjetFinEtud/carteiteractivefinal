import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const Review = ({ formData }) => {
  const { nom, prenom, email, master, annee, domaine, localisation, nom_poste, nom_entreprise, description, annee_debut, annee_fin } = formData;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Informations personnelles
        </Typography>
        <List disablePadding>
          <ListItem>
            <ListItemText primary="Nom Prénom" secondary={`${nom} ${prenom}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Adresse mail" secondary={email} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Master et Année d'obtention" secondary={`${master} ${annee}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Domaine" secondary={domaine} />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Informations sur le poste
        </Typography>
        <List disablePadding>
          <ListItem>
            <ListItemText primary="Poste & Nom de l'entreprise" secondary={`${nom_poste} ${nom_entreprise}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Description des missions" secondary={description} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Année Début -- Fin" secondary={`${annee_debut} "--" ${annee_fin}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Localisation" secondary={localisation} />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
}

export default Review;
