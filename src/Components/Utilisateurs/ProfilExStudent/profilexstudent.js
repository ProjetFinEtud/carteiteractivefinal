import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Poste from "./Poste"; 
import UserInfo from "./UserInfo"; 
import ChangePassword from "./ChangePassword"; 
import DeleteExstudent from "./DeleteExstudent"
import ChangeLocalisation from "./ChangeLocalisation"
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
        <Tab value="postes" label="Postes" />
        <Tab value="localisation" label="Changer votre localisation" />
        <Tab value="password" label="Changer le mot de passe" />
        <Tab value="delete" label="Supprimer votre compte" />
      </Tabs>
      {tabValue === "password" && <ChangePassword />}
      {tabValue === "postes" && <Poste />}
      {tabValue === "delete" && <DeleteExstudent />}
      {tabValue === "localisation" && <ChangeLocalisation />}
      {tabValue === "userInfo" && <UserInfo />}
    </div>
  );
};

export default ProfilExStudent;
