import * as React from 'react';
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
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informations personnelles
        </Typography>
        <List disablePadding>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Nom Prénom" />
            <Typography variant="body2">{nom + " " + prenom}</Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Adresse mail" />
            <Typography variant="body2">{email}</Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Master et Année d'obtention" />
            <Typography variant="body2">{master + " " + annee}</Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Domaine" />
            <Typography variant="body2">{domaine}</Typography>
          </ListItem>
        </List>
      </Grid>
      <Divider orientation="vertical" flexItem variant="middle" />
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informations sur le poste
        </Typography>
        <List disablePadding>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Poste & Non de l'entreprise" />
            <Typography variant="body2">{nom_poste + " " + nom_entreprise}</Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Description des missions" />
            <Typography variant="body2">{description}</Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Année Début & Année de Fin du poste" />
            <Typography variant="body2">{annee_debut + " " + annee_fin}</Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Localisation" />
            <Typography variant="body2">{localisation}</Typography>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
}

export default Review;
