import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";
import "./carousel.css"; // Importez vos styles CSS personnalisés ici

function CarouselHome() {
  const items = [
    {
      title: "Contexte de l'application",
      description:
        "De tout temps, les établissements d'enseignement supérieur ont joué un rôle crucial dans la formation et l'épanouissement des individus...",
    },
    {
      title: "Défis des diplômés",
      description:
        "Lorsqu'il s'agit de transition vers le monde professionnel, les diplômés font face à divers défis...",
    },
    {
      title: "Objectif de l'application",
      description:
        "Cette application vise principalement à faciliter l'insertion professionnelle des anciens élèves en mettant en relation les diplômés...",
    },
    {
      title: "Fonctionnalités de l'application",
      description:
        "Les fonctionnalités comprennent la possibilité pour les anciens élèves de partager leur expérience, mettre en avant leur parcours...",
    },
  ];

  return (
    <div className="carousel-container">
      <Carousel >
        {items.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </Carousel>
    </div>
  );
}

function Item(props) {
  return (
    <>
    <Paper>
      <Typography variant="h1" gutterBottom className="carousel-title">
        {props.item.title}
      </Typography>
      <Typography variant="body1" paragraph className="carousel-description">
        {props.item.description}
      </Typography>
    </Paper>
    </>
  
  );
}

export default CarouselHome;
