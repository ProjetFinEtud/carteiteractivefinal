import React, { useState, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import "leaflet/dist/leaflet.css";
import InputLabel from "@mui/material/InputLabel";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useMapEvents } from "react-leaflet";
import { Form, Button } from "react-bootstrap";
import { FullscreenControl } from "react-leaflet-fullscreen";

export default function ChangeLocalisation() {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locationInfo, setLocationInfo] = useState("");
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");

  const reverseGeoCoding = useCallback(async (lat, lng) => {
    const GEOCODE_URL = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=${lng},${lat}`;
    try {
      const response = await fetch(GEOCODE_URL);
      const data = await response.json();
      const { address } = data;
      const city = address.City;
      const country = address.CountryCode;
      setLocationInfo(`${city}, ${country}`);
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
  }, []);

  function AddMarkerToClick() {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        reverseGeoCoding(lat, lng);
        setSuccess("")
      },
    });
    return null;
  }

  const customIcon = new Icon({
    iconUrl: require("../../../img/placeholder.png"),
    iconSize: [30, 30],
  });

  const handleChangeLocation = async () => {
    if (!markerPosition) {
      setErrors("Veuillez marquer votre localisation sur la carte.");
      return;
    }

    try {
      const response = await fetch(
        //`server/user/changeLocalisation`,
        `/user/changeLocalisation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accessToken: sessionStorage.getItem("accessToken"),
          },
          body: JSON.stringify({
            lat: markerPosition.lat,
            lng: markerPosition.lng,
          }),
        }
      );

      if (!response.ok) {
        console.error(
          "Erreur lors de la suppression de l'étudiant:",
          response.status
        );
        return;
      }
  
    setSuccess("Votre localisation à été changer avec succès");

    window.location.reload();
      
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'étudiant:",
        error.message
      );
    }
    setErrors("");
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Localisation
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <InputLabel id="location-label">
            Marquez votre localisation sur la carte
          </InputLabel>
          <Form.Text className={errors ? "text-danger" : "text-success"} style={{fontSize:"20px"}}>
            {errors || success}
          </Form.Text>
          <div style={{ height: "60vh" }}>
            <MapContainer
              center={[48.860197534643966, 2.3469543457031254]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <AddMarkerToClick />
              {markerPosition && (
                <Marker position={markerPosition} icon={customIcon}>
                  <Popup>
                    <div>{locationInfo}</div>
                  </Popup>
                </Marker>
              )}
              <FullscreenControl position="topright" />
            </MapContainer>
          </div>
          <Button variant="primary" onClick={handleChangeLocation}>
            Changer la localisation
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
