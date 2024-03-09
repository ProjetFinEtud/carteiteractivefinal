import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Review = ({ formData }) => {
  console.log(formData)
  const { nom, prenom, email, master, annee, domaine, localisation, nom_poste, nom_entreprise, description, annee_debut, annee_fin } = formData;

  return (
    <React.Fragment>
      {console.log(formData)}
      <Typography variant="h6" gutterBottom>
        Résumé de l'inscription
      </Typography>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Nom" />
          <Typography variant="body2">{nom}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Prénom" />
          <Typography variant="body2">{prenom}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Adresse mail" />
          <Typography variant="body2">{email}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Master" />
          <Typography variant="body2">{master}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Année" />
          <Typography variant="body2">{annee}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Domaine" />
          <Typography variant="body2">{domaine}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Poste" />
          <Typography variant="body2">{nom_poste}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Entreprise" />
          <Typography variant="body2">{nom_entreprise}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Description" />
          <Typography variant="body2">{description}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Annee Début" />
          <Typography variant="body2">{annee_debut}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Annee Fin" />
          <Typography variant="body2">{annee_fin}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Localisation" />
          <Typography variant="body2">{localisation}</Typography>
        </ListItem>
      </List>
    </React.Fragment>
  );
}

export default Review;
