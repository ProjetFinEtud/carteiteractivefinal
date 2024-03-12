import React, { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SchoolIcon from "@mui/icons-material/School";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LayersIcon from "@mui/icons-material/Layers";
import UserDesactived from "./Utilisateurs/Desactive";
import UserActived from "./Utilisateurs/Active";
import Domaine from "./Domaine/Domaine";
import Master from "./Master/Master";
import ProfilAdmin from "./Utilisateurs/ProfilAdmin/profiladmin";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Import de l'icône de profil
import { Link } from "react-router-dom";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  // zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 240,
    width: `calc(100% - 240px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: 240,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [currentComponent, setCurrentComponent] = useState("profil"); 
  const [showComponentDomaine, setShowComponentDomaine] = useState(false); 
  const [showComponentMaster, setShowComponentMaster] = useState(false); 
  const [showComponentUser, setShowComponentUser] = useState(false); 

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [value, setValue] = useState("userdesactived"); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleComponent = (componentName) => {
    if (currentComponent !== componentName) {
      setCurrentComponent(componentName); 
    }
  };
  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ display: "flex", paddingTop:"60px" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "5px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Page Admin
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              <ListItemButton onClick={() => toggleComponent("profil")}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profil" />
              </ListItemButton>
              <ListItemButton onClick={() => toggleComponent("domaine")}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Domaines" />
              </ListItemButton>
              <ListItemButton onClick={() => toggleComponent("user")}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Utilisateurs" />
              </ListItemButton>
              <ListItemButton onClick={() => toggleComponent("master")}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Master" />
              </ListItemButton>
              <ListItemButton component={Link} to="/carte">
                <ListItemIcon>
                  <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Carte" />
              </ListItemButton>
              <ListItemButton component={Link} to="/logout">
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Déconnection" />
              </ListItemButton>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        {/* <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        > */}
        <Toolbar />
        {currentComponent === "profil" && <ProfilAdmin />}
        {currentComponent === "domaine" && <Domaine />}
        {currentComponent === "master" && <Master />}
        {currentComponent === "user" && (
          <div style={{ height: "100vh", width: "100%" }}>
            <Box
              width="100%"
              height="90%"
              sx={{
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="white"
                centered
                variant="fullWidth"
                sx={{ bgcolor: "white.main" }}
              >
                <Tab value="userdesactived" label="Utilisateurs Désactivés" />
                <Tab value="useractived" label="Utilisateurs Activés" />
              </Tabs>
              <Box sx={{ p: 3 }}>
                {value === "userdesactived" && <UserDesactived />}
                {value === "useractived" && <UserActived />}
              </Box>
            </Box>
          </div>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
