import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import UserInfo from "./UserInfo"; // Importer le composant pour la création de poste
import ChangePassword from "./ChangePassword"; // Importer le composant pour la création de poste
import CreateAdmin from "./CreateAdmin"; // Importer le composant pour la création de poste
import Box from "@mui/material/Box";
const ProfilExStudent = () => {
  const [tabValue, setTabValue] = useState("userInfo");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ height: "100vh", width: "100%"}}>
    <Box
    width="80%"
      height="90%"
      sx={{
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab value="userInfo" label="Vos informations" />
        <Tab value="createadmin" label="Crée un nouveau administrateur" />
        <Tab value="password" label="Changer le mot de passe" />
      </Tabs>
      {tabValue === "password" && <ChangePassword />}
      {tabValue === "createadmin" && <CreateAdmin />}
      {/* {tabValue === "postes" && <Postes />}
      {tabValue === "delete" && <Postes />} */}
      {tabValue === "userInfo" && <UserInfo />}
      </Box>
    </div>
  );
};

export default ProfilExStudent;
