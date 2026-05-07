import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const HeatLayer = ({ reports }) => {
  const map = useMap();

  useEffect(() => {

    // 🔥 Generate Heat Points
    const points = reports
      .filter((r) => r.latitude && r.longitude)
      .map((r) => [
        Number(r.latitude),
        Number(r.longitude),
        1, // intensity
      ]);

    if (points.length === 0) return;

    // 🔥 Create Heat Layer
    const heatLayer = L.heatLayer(points, {

      radius: 35,       // size of heat circle
      blur: 30,         // smoothness
      maxZoom: 17,
      minOpacity: 0.4,

      // 🎨 Heat Colors
      gradient: {
        0.2: "#3b82f6", // blue
        0.4: "#22c55e", // green
        0.6: "#eab308", // yellow
        0.8: "#f97316", // orange
        1.0: "#ef4444", // red
      },

    }).addTo(map);

    // 📍 Auto Focus
    map.setView(
      [Number(points[0][0]), Number(points[0][1])],
      12
    );

    // Cleanup
    return () => {
      map.removeLayer(heatLayer);
    };

  }, [reports, map]);

  return null;
};

const HeatmapView = ({ reports }) => {
  return (

    <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">
          📍 Issue Heatmap
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Red zones indicate areas with high complaint density
        </p>
      </div>

      {/* Map */}
      <div className="h-[500px] w-full">

        <MapContainer
          center={[26.8467, 80.9462]} // Lucknow default
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >

          {/* 🌍 Map Tiles */}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🔥 Heatmap Layer */}
          <HeatLayer reports={reports} />

        </MapContainer>

      </div>
    </div>
  );
};

export default HeatmapView;