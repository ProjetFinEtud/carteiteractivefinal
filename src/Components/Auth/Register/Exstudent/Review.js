import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

const Review = ({ formData }) => {
  const {
    nom,
    prenom,
    email,
    master,
    annee,
    domaine,
    localisation,
    nom_poste,
    nom_entreprise,
    description,
    annee_debut,
    annee_fin,
  } = formData;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Résumé de l'inscription
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <Paper variant="outlined" sx={{ padding: 2 }}>
          <List disablePadding>
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Nom" />
              <Typography variant="body2">{nom}</Typography>
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Prénom" />
              <Typography variant="body2">{prenom}</Typography>
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Adresse mail" />
              <Typography variant="body2">{email}</Typography>
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Diplôme" />
              <Typography variant="body2">{master}</Typography>
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Année du diplôme" />
              <Typography variant="body2">{annee}</Typography>
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Divider orientation="vertical" sx={{ height: "100%" }} />
      </Grid>
      <Grid item xs={5}>
        <Paper variant="outlined" sx={{ padding: 2 }}>
          <List disablePadding>
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Poste" />
              <Typography variant="body2">{nom_poste}</Typography>
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Entreprise" />
              <Typography variant="body2">{nom_entreprise}</Typography>
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Description" />
              <Typography variant="body2">{description}</Typography>
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Année de début du poste" />
              <Typography variant="body2">{annee_debut}</Typography>
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText primary="Année de fin du poste" />
              <Typography variant="body2">{annee_fin}</Typography>
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Review;
