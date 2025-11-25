import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const CourierMap = ({ lat, lng, zoom = 15, height = "400px" }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      style={{ height: height, width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[lat, lng]}>
        <Popup>Kurir je ovde</Popup>
      </Marker>
    </MapContainer>
  );
};

export default CourierMap;
