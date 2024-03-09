import React, { useState, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import "leaflet/dist/leaflet.css";
import InputLabel from "@mui/material/InputLabel";
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import {  Icon } from "leaflet";
import { useMapEvents } from "react-leaflet";
import { Form } from "react-bootstrap";
import { FullscreenControl } from "react-leaflet-fullscreen";

export default function Localisation({ onFieldChangeLon , onFieldChangeShow, onFieldChangeLat, formData, errors}) {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locationInfo, setLocationInfo] = useState("");

  const reverseGeoCoding = useCallback(async (lat, lng) => {
    const GEOCODE_URL = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=${lng},${lat}`;
    try {
      const response = await fetch(GEOCODE_URL);
      const data = await response.json();
      const { address } = data;
      const city = address.City;
      const country = address.CountryCode;
      setLocationInfo(`${city}, ${country}`);
      onFieldChangeShow("localisation", city + " " + country)
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
  }, [onFieldChangeShow]);

  useEffect(() => {
    if (formData.laltitude && formData.longitude) {
      const lat = parseFloat(formData.laltitude);
      const lng = parseFloat(formData.longitude);
      setMarkerPosition({ lat, lng });
      const fetchData = async () => {
        try {
          await reverseGeoCoding();
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      };
      fetchData();
    } 
  }, [formData, reverseGeoCoding]);

  function AddMarkerToClick() {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        onFieldChangeLat("laltitude", lat);
        onFieldChangeLon("longitude", lng); 
        reverseGeoCoding(lat, lng);
      },
    });
    return null;
  }

  const customIcon = new Icon({
    iconUrl :require("../../../../img/placeholder.png"),
    iconSize: [30, 30]
  });



  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Localisation
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <InputLabel id="location-label">Marquez votre localisation sur la carte</InputLabel>
          <Form.Text className="text-danger">{errors.localisation}</Form.Text>
          <div style={{ height: "200px" }}>
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
                    {/* <div>Latitude: {markerPosition.lat}, Longitude: {markerPosition.lng}</div> */}
                  </Popup>
                </Marker>
              )}
              <FullscreenControl position="topright" />
            </MapContainer>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
