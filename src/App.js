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
function App() {
  return (
    <div className="with-sidebar">
      <ParticlesBg type="circle" bg={true} />

      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Outlet />}>
            <Route index element={<Acceuil />} />
            <Route path="#/forgotpassword" element={<ForgotPassword />} />
            <Route path="#/register" element={<Register />} />
            <Route path="#/connexion" element={<Connexion />} />
            <Route path="#/carte" element={<Map />} />
            <Route path="#/userdesactived" element={<UserDesactived />} />
            <Route path="#/useractived" element={<UserActived />} />
            <Route path="#/domaine" element={<Domaine />} />
            <Route path="#/updatepass" element={<UpdatePass />} />
            <Route path="#/master" element={<Master />} />
            <Route path="#/dashbordAdmin" element={<DashboardAdmin />} />
            <Route path="#/dashbordExstudent" element={<DashboardExStudent />} />
            <Route path="#/dashbordStudent" element={<DashboardStudent />} />
            <Route path="#/politique" element={<Politique />} />
            <Route path="#/logout" element={<Logout />} />
            <Route path="#/*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
