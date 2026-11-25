"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const markerIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25,41], iconAnchor: [12,41]
});

function ClickHandler({ onChange }: { onChange: (p:[number,number])=>void }) {
  useMapEvents({ click(e) { onChange([e.latlng.lat,e.latlng.lng]); } });
  return null;
}

export default function LeafletMap({ position, onChange }: { position:[number,number], onChange:(p:[number,number])=>void }) {
  return <div style={{height:320,borderRadius:12,overflow:"hidden"}}>
    <MapContainer center={position} zoom={13} style={{height:"100%",width:"100%"}}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"}/>
      <Marker position={position} icon={markerIcon}/>
      <ClickHandler onChange={onChange}/>
    </MapContainer>
  </div>;
}
