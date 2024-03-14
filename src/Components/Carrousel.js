import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";
import "./carousel.css";

function CarouselHome() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/server/user/allAcc",
        {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        }
      );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        if (data.length === 0) {
          setItems(staticItems);
        } else {
          setItems(data.columns);
        }
      } catch (error) {
        console.error("Erreur:", error.message);
      }
    };

    fetchHomeData();
  }, []);

  // Données statiques à afficher si la table est vide
  const staticItems = [
    {
      acc_tire: "Contexte de l'application",
      acc_texte:
        "De tout temps, les établissements d'enseignement supérieur ont joué un rôle crucial dans la formation et l'épanouissement des individus...",
    },
    {
      acc_titre: "Défis des diplômés",
      acc_texte:
        "Lorsqu'il s'agit de transition vers le monde professionnel, les diplômés font face à divers défis...",
    },
    {
      acc_titre: "Objectif de l'application",
      acc_texte:
        "Cette application vise principalement à faciliter l'insertion professionnelle des anciens élèves en mettant en relation les diplômés...",
    },
    {
      acc_titre: "Fonctionnalités de l'application",
      acc_texte:
        "Les fonctionnalités comprennent la possibilité pour les anciens élèves de partager leur expérience, mettre en avant leur parcours...",
    },
  ];

  return (
    <div className="carousel-container">
      <Carousel>
        {items.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </Carousel>
    </div>
  );
}

function Item({ item }) {
  return (
    <Paper>
      <Typography variant="h1" gutterBottom className="carousel-title">
        {item.acc_titre}
      </Typography>
      <Typography variant="body1" paragraph className="carousel-description">
        {item.acc_texte}
      </Typography>
    </Paper>
  );
}

export default CarouselHome;
