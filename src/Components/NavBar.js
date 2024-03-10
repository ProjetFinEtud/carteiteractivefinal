import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function NavBar() {
  const [authSession, setAuthSession] = useState(false);
  const [pageAccess, setPageAccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/server/auth/verifAuth", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });

        if (response.status === 202) {
          setAuthSession(true);
          setPageAccess("dashbordAdmin");
        } else if (response.status === 203) {
          setAuthSession(true);
          setPageAccess("dashbordExstudent");
        } else if (response.status === 204) {
          setAuthSession(true);
          setPageAccess("dashbordStudent");
        } else {
          setAuthSession(false);
        }
      } catch (error) {
        //console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <AppBar position="fixed" style={{marginBottom:"60px"}}>
      <Toolbar>
        {!authSession ? (
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Carte interactive
            </Typography>
            <IconButton color="inherit" component={Link} to="/">
              <HomeIcon />
            </IconButton>
            <Typography variant="body1" color="inherit" sx={{ marginLeft: '10px' }}>
              Connexion
            </Typography>
            <IconButton color="inherit" component={Link} to="/connexion">
              <AccountCircleIcon />
            </IconButton>
            <Typography variant="body1" color="inherit" sx={{ marginLeft: '10px' }}>
              Inscription
            </Typography>
            <IconButton color="inherit" component={Link} to="/register">
              <AssignmentIndIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Carte interactive
            </Typography>
            <IconButton color="inherit" component={Link} to="/">
              <HomeIcon />
            </IconButton>
            <Typography variant="body1" color="inherit" sx={{ marginLeft: '10px' }}>
              Dashbord
            </Typography>
            <IconButton color="inherit" component={Link} to={`/${pageAccess}`}>
              <AccountCircleIcon />
            </IconButton>
            <Typography variant="body1" color="inherit" sx={{ marginLeft: '10px' }}>
              Déconnexion
            </Typography>
            <IconButton color="inherit" component={Link} to="/logout">
              <ExitToAppIcon />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
