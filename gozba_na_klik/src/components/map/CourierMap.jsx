import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

const RecenterOnMarker = ({ lat, lng, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.setView([lat, lng], zoom, {
      animate: true,
    });
  }, [lat, lng, zoom, map]);

  return null;
};

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
      <RecenterOnMarker lat={lat} lng={lng} zoom={zoom} />
    </MapContainer>
  );
};

export default CourierMap;
