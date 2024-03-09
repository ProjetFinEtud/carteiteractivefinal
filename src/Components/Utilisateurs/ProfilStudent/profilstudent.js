import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import UserInfo from "./UserInfo"; // Importer le composant pour la création de poste
import ChangePassword from "./ChangePassword"; // Importer le composant pour la création de poste
import DeleteStudent from "./DeleteStudent"; // Importer le composant pour la création de poste

const ProfilExStudent = () => {
  const [tabValue, setTabValue] = useState("userInfo");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab value="userInfo" label="Vos informations" />
        <Tab value="password" label="Changer le mot de passe" />
        <Tab value="delteaccount" label="Supprimer votre compte" />
      </Tabs>
      {tabValue === "password" && <ChangePassword />}
      {tabValue === "userInfo" && <UserInfo />}
      {tabValue === "delteaccount" && <DeleteStudent />}
    </div>
  );
};

export default ProfilExStudent;
