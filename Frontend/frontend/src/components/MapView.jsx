import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔥 Custom Icons
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

const workerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
  iconSize: [35, 35],
});

const MapView = ({ report }) => {

  if (!report || !report.latitude || !report.longitude)
    return null;

  // ✅ Convert to Number
  const userPos = [
    Number(report.latitude),
    Number(report.longitude),
  ];

  const workerPos = report.completionLocation
    ? [
        Number(report.completionLocation.lat),
        Number(report.completionLocation.lng),
      ]
    : null;

  return (
    <div className="h-full w-full">

      <MapContainer
        key={report._id}
        center={userPos}
        zoom={18}
        scrollWheelZoom={true}
        className="h-full w-full rounded-2xl z-0"
      >

        {/* 🌍 Tile Layer */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 Complaint Marker */}
        <Marker position={userPos} icon={userIcon}>
          <Popup>
            📍 Complaint Location
          </Popup>
        </Marker>

        {/* 🛠 Completion Marker */}
        {workerPos && (
          <Marker position={workerPos} icon={workerIcon}>
            <Popup>
              🛠 Completion Location
            </Popup>
          </Marker>
        )}

        {/* 🔗 Distance Line */}
        {workerPos && (
          <Polyline
            positions={[userPos, workerPos]}
            pathOptions={{
              color: "#2563eb",
              weight: 5,
              dashArray: "8",
            }}
          />
        )}

      </MapContainer>
    </div>
  );
};

export default MapView;