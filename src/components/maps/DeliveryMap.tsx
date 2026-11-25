"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function DeliveryMap() {
  const [point,setPoint] = useState<[number,number]>([26.5167, 89.5333]);
  return <div className="card" style={{padding:16}}>
    <h3>Choose delivery location</h3>
    <p className="muted" style={{fontSize:13}}>Move the map marker to your delivery address. Map shown centered on Alipurduar as a sample location.</p>
    <Map position={point} onChange={setPoint}/>
    <p style={{fontSize:13}}>Latitude: {point[0].toFixed(6)} · Longitude: {point[1].toFixed(6)}</p>
  </div>;
}
