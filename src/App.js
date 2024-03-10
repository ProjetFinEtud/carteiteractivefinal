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
            <Route path="client/forgotpassword" element={<ForgotPassword />} />
            <Route path="client/register" element={<Register />} />
            <Route path="client/connexion" element={<Connexion />} />
            <Route path="carte" element={<Map />} />
            <Route path="client/userdesactived" element={<UserDesactived />} />
            <Route path="client/useractived" element={<UserActived />} />
            <Route path="client/domaine" element={<Domaine />} />
            <Route path="client/updatepass" element={<UpdatePass />} />
            <Route path="client/master" element={<Master />} />
            <Route path="client/dashbordAdmin" element={<DashboardAdmin />} />
            <Route path="client/dashbordExstudent" element={<DashboardExStudent />} />
            <Route path="client/dashbordStudent" element={<DashboardStudent />} />
            <Route path="client/politique" element={<Politique />} />
            <Route path="client/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
