import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";

const HeatLayer = ({ reports }) => {
  const map = useMap();

  useEffect(() => {
    const points = reports
      .filter(r => r.latitude && r.longitude)
      .map(r => [r.latitude, r.longitude, 0.5]);

    if (points.length === 0) return;

    const heat = L.heatLayer(points, { radius: 25 }).addTo(map);

    map.setView([points[0][0], points[0][1]], 12);

    return () => {
      map.removeLayer(heat);
    };
  }, [reports, map]);

  return null;
};

const HeatmapView = ({ reports }) => {
  return (
    <MapContainer
      center={[26.8467, 80.9462]} // default (Lucknow)
      zoom={12}
      style={{ height: "400px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HeatLayer reports={reports} />
    </MapContainer>
  );
};

export default HeatmapView;