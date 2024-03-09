import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import LegendIconePanel from "./LegendIconePanel";
import LegendUserPanel from "./LegendUserPanel";
import { FullscreenControl } from "react-leaflet-fullscreen";
import { MDBCardTitle, MDBCardImage } from "mdb-react-ui-kit";
import Modal from "react-bootstrap/Modal";
import { useMapEvents } from "react-leaflet";
import Avatar from "@mui/material/Avatar";
import { jwtDecode } from "jwt-decode";

function App() {
  const [data, setData] = useState([]);
  const [dataDomaine, setDataDomaine] = useState([]);
  const [dataPoste, setDataPoste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedPostes, setSelectedPostes] = useState([]);
  const [selectedMarkerPosition, setSelectedMarkerPosition] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [validateSend, setValidateSend] = useState("");
  const [errorsSend, setErrosSend] = useState("");
  const [username, setUsername] = useState("")
  const [userType, setUserType] = useState("")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseUsers = await fetch(
          "/user/usersExstudentActived",
          {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          }
        );
        if (!responseUsers.ok) {
          console.error(
            "Erreur lors de la récupération des données:",
            responseUsers.status
          );
          return;
        }
        const jsonData = await responseUsers.json();

        const newData = jsonData.map((item) => ({
          id: item.exs_id,
          lat: item.exs_laltitude,
          lon: item.exs_longitude,
          nom: item.exs_nom,
          prenom: item.exs_prenom,
          photo: item.exs_photo,
          dom_id: item.dom_id,
          dom_nom: item.dom.dom_nom,
          mas_nom: item.ma.mas_nom,
          icone: item.dom.dom_icone,
          pre_id: item.t_poste_pos[0].pre_id,
          pos_entreprise: item.t_poste_pos[0].pos_entreprise,
          pos_description: item.t_poste_pos[0].pos_description,
        }));

        setData(newData);
        setFilteredUsers(newData);
        const responseDomaines = await fetch(
          "/user/allDomaines",
          {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          }
        );
        if (!responseDomaines.ok) {
          console.error(
            "Erreur lors de la récupération des données:",
            responseDomaines.status
          );
          return;
        }
        const jsonDataDomaine = await responseDomaines.json();
        const newDataDomaine = jsonDataDomaine.columns.map((item) => ({
          id: item.dom_id,
          nom: item.dom_nom,
          icone: item.dom_icone,
        }));
        setDataDomaine(newDataDomaine);
        const responsePostes = await fetch(
          "/user/allPrePostes",
          {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          }
        );
        if (!responsePostes.ok) {
          console.error(
            "Erreur lors de la récupération des données:",
            responsePostes.status
          );
          return;
        }
        const jsonDataPostes = await responsePostes.json();
        if (jsonDataPostes) {
          const newDataPoste = jsonDataPostes.pre_post.map((item) => ({
            id: item.pre_id,
            nom: item.pre_nom,
          }));
          setDataPoste(newDataPoste);
        }
        const token = sessionStorage.getItem("accessToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          setUsername(decodedToken.username);
          setUserType(decodedToken.userType);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  const handleFilterDomaineChange = (domains) => {
    setSelectedDomains(domains);
  };
  const handleFilterPosteChange = (postes) => {
    setSelectedPostes(postes);
  };

  const handleUserPanelClick = (user) => {
    setSelectedMarkerPosition(user);
  };

  const openUserModal = (student) => {
    setSelectedStudent(student);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  useEffect(() => {
    var filteredUsers = data.filter((user) =>
      selectedDomains.includes(user.dom_id)
    );
    setFilteredUsers(filteredUsers);
  }, [selectedDomains]);

  useEffect(() => {
    var filteredUsers = data.filter((user) =>
      selectedPostes.includes(user.pre_id)
    );
    setFilteredUsers(filteredUsers);
  }, [selectedPostes]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSendAsk = async (id) => {
    const exs_id = id;
    try {
      const url = "/user/sendask";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ exs_id }),
      });

      if (response.ok) {
        setValidateSend("Votre demande à bien été transmise");
      } else {
        if (response.status === 403) {
          setErrosSend("Demande déjà envoyer");
        }
      }
    } catch (error) {
      setErrosSend("Veuillez réssayer plutard");
    }
  };

  function MapEventsHandler() {
    useMapEvents({
      click: () => {
        setSelectedMarkerPosition(null);
      },
    });

    return null;
  }

  const handleDeleteMessage = () => {
    setValidateSend("");
    setErrosSend("");
  };

  return (
    <div style={{ display: "flex", paddingTop:"60px" }}>
      <MapContainer
        style={{
          height: "calc(100vh - 60px)",
          width: "100%",
        }}
        center={[48.860197534643966, 2.3469543457031254]}
        zoom={8}
        maxZoom={14}
        minZoom={3}
      >
        <MapEventsHandler />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LegendUserPanel items={data} onUserClick={handleUserPanelClick} />
        <LegendIconePanel
          domaines={dataDomaine}
          postes={dataPoste}
          onFilterDomaineChange={handleFilterDomaineChange}
          onFilterPosteChange={handleFilterPosteChange}
        />
        <MarkerClusterGroup chunkedLoading>
          {filteredUsers.map((item) => {
            const customIcon = new L.Icon({
              iconUrl: "./upload/" + item.icone,
              iconSize: [38, 38],
              iconAnchor: [32, 32],
              popupAnchor: [0, -32],
            });

            return (
              <Marker
                key={item.id}
                position={[item.lat, item.lon]}
                icon={customIcon}
              >
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <h6>
                      <strong>
                        {item.prenom} {item.nom}
                      </strong>
                    </h6>
                    <button
                      type="button"
                      className="btn btn-info btn-sm"
                      onClick={() => openUserModal(item)}
                    >
                      Voir le profil
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>

        {selectedMarkerPosition && (
          <Marker
            position={[selectedMarkerPosition.lat, selectedMarkerPosition.lon]}
            icon={
              new L.Icon({
                iconUrl: "/images/" + selectedMarkerPosition.icone, // Utilisez l'URL de l'icône de selectedMarkerPosition
                iconSize: [50, 50],
                iconAnchor: [32, 32],
                popupAnchor: [0, -32],
              })
            }
          >
            <Popup>
              <div style={{ textAlign: "center" }}>
                <h6>
                  <strong>
                    {selectedMarkerPosition.prenom} {selectedMarkerPosition.nom}
                  </strong>
                </h6>
                <button
                  type="button"
                  className="btn btn-info btn-sm"
                  onClick={() => openUserModal(selectedMarkerPosition)}
                >
                  Voir le profil
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        <FullscreenControl position="topright" />
      </MapContainer>

      <Modal
        show={isUserModalOpen}
        onHide={closeUserModal}
        onClick={handleDeleteMessage}
        centered
      >
        <Modal.Body>
          {selectedStudent && (
            <div className="d-flex text-black">
              <div className="flex-shrink-0">
                <Avatar
                  src={"./upload/" + selectedStudent.photo}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{ width: 150, height: 150, objectFit: "cover" }}
                />
              </div>
              <div className="flex-grow-1 ms-3">
                <MDBCardTitle>
                  {selectedStudent.nom ?? ""} {selectedStudent.prenom ?? ""}
                </MDBCardTitle>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="small text-muted mb-1">Domaine</p>
                      <p className="mb-0">{selectedStudent.dom_nom}</p>
                    </div>
                    <div>
                      <p className="small text-muted mb-1">Master</p>
                      <p className="mb-0">{selectedStudent.mas_nom}</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="small text-muted mb-1">Entreprise</p>
                      <p className="mb-0">{selectedStudent.pos_entreprise}</p>
                    </div>
                    <div>
                      <p className="small text-muted mb-1">Poste</p>
                      <p className="mb-0">
                        {
                          dataPoste.find(
                            (poste) => poste.id === selectedStudent.pre_id
                          )?.nom
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="small text-muted mb-1">
                    Description des missions
                  </p>
                  <p className="mb-0">{selectedStudent.pos_description}</p>
                </div>
                {validateSend && (
                  <div className="alert alert-success mt-3" role="alert">
                    {validateSend}
                  </div>
                )}
                {errorsSend && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {errorsSend}
                  </div>
                )}
                {userType === "student" && (
                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={() => handleSendAsk(selectedStudent.id)}
                  >
                    Faire une demande de contact
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
