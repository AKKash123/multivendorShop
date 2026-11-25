import DeliveryMap from "@/components/maps/DeliveryMap";
export default function LocationDemo() {
  return <main className="container" style={{padding:"40px 0"}}><h1 className="section-title">Delivery location picker</h1><p className="muted">OpenStreetMap + Leaflet proof of concept.</p><DeliveryMap/></main>;
}
