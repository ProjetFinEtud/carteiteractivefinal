import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";
import "./carousel.css";

function CarouselHome() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/accueil/allAcc",
       // const response = await fetch("/server/auth/allAcc",
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


  const staticItems = [
    {
      acc_tire: "Bienvenue sur la carte interactive",
      acc_texte:
        "Voir ou se trouve vos camarades, entreprendre des projets avec des jeunes de votre ancien Master, cherchez des talents dans votre ancien Master tout ça est possible",
    },
    {
      acc_titre: "Inscrivez vous et commencer l'aventure",
      acc_texte:
        "Une aventure, pleins de bienveillance et de soutient mutuel",
    },
    {
      acc_titre: "Objectif de l'application",
      acc_texte:
        "Mettre en relation les anciens élèves de nos Master et les étudiants actuels pour permettre une insertion professionnel facile",
    },
    {
      acc_titre: "Fonctionnalités de l'application",
      acc_texte:
        "Carte, Filtrage, Tchat... pleins d'autres suprise à venir",
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
