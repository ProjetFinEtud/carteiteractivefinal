import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Register from "./Components/Register";
import ForgotPassword from "./Components/Auth/ForgotPassword/ForgotPassword";
import Connexion from "./Components/Auth/Login/Login";

import Map from "./Components/Carte/Map";
import UserDesactived from "./Components/Utilisateurs/Desactive";
import UserActived from "./Components/Utilisateurs/Active";
import Domaine from "./Components/Domaine/Domaine";
import UpdatePass from "./Components/Utilisateurs/Update";
import Master from "./Components/Master/Master";
import DashboardAdmin from "./Components/DashbordAdmin";
import DashboardExStudent from "./Components/DashbordExstudent";
import DashboardStudent from "./Components/DashbordStudent";
import Acceuil from "./Components/Accueil";
import NavBar from "./Components/NavBar";
import Politique from "./Components/Politique";
import Logout from "./Components/logout";
import ParticlesBg from "particles-bg";
import NotFound from "./NotFound";
import { useAuth } from "./Components/AuthContext";

function App() {
  const { authSession, authAdmin, authExs, authStu } = useAuth();

  const renderRoutes = () => {
    return (
      <Routes>
        <Route index element={<Acceuil />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="register" element={<Register />} />
        <Route path="connexion" element={<Connexion />} />
        {authSession ? (
          <>
            <Route path="carte" element={<Map />} />

            <Route path="updatepass" element={<UpdatePass />} />

            <Route path="logout" element={<Logout />} />
          </>
        ) : null}
        {authAdmin ? (
          <>
            <Route path="userdesactived" element={<UserDesactived />} />
            <Route path="useractived" element={<UserActived />} />
            <Route path="domaine" element={<Domaine />} />
            <Route path="master" element={<Master />} />
            <Route path="dashbordAdmin" element={<DashboardAdmin />} />
          </>
        ) : null}
        {authExs ? (
          <>
            <Route path="dashbordExstudent" element={<DashboardExStudent />} />
          </>
        ) : null}
        {authStu ? (
          <>
            <Route path="dashbordStudent" element={<DashboardStudent />} />
          </>
        ) : null}
        <Route path="politique" element={<Politique />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  };

  return (
    <div className="with-sidebar">
      <ParticlesBg type="circle" bg={true} />
      <BrowserRouter>
        <NavBar />
        {renderRoutes()}
      </BrowserRouter>
    </div>
  );
}

export default App;
