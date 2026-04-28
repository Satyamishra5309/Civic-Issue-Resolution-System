import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";

const HeatmapView = ({ reports }) => {

  useEffect(() => {
    if (!reports || reports.length === 0) return;

    const points = reports.map(r => [
      r.latitude,
      r.longitude,
      0.5 // intensity
    ]);

    const map = L.map("heatmap");

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const heat = L.heatLayer(points, { radius: 25 });
    heat.addTo(map);

    map.setView([reports[0].latitude, reports[0].longitude], 12);

    return () => {
      map.remove();
    };
  }, [reports]);

  return <div id="heatmap" style={{ height: "400px" }} />;
};

export default HeatmapView;