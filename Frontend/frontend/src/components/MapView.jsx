import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";
import L from "leaflet";

// 🔥 Custom Icons
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const workerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
  iconSize: [30, 30],
});

const MapView = ({ report }) => {
  if (!report || !report.latitude || !report.longitude) return null;

  const userPos = [report.latitude, report.longitude];

  const workerPos = report.completionLocation
    ? [report.completionLocation.lat, report.completionLocation.lng]
    : null;

  return (
    <MapContainer
      key={report._id}
      center={userPos}
      zoom={15}
      className="h-full w-full rounded-xl"
    >
      {/* 🌍 Clean Tile */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      {/* 📍 User Marker */}
      <Marker position={userPos} icon={userIcon}>
        <Popup>
          <div className="text-sm">
            <strong>📍 Complaint Location</strong>
          </div>
        </Popup>
      </Marker>

      {/* 🛠 Worker Marker */}
      {workerPos && (
        <Marker position={workerPos} icon={workerIcon}>
          <Popup>
            <div className="text-sm">
              <strong>🛠 Completed Here</strong>
            </div>
          </Popup>
        </Marker>
      )}

      {/* 🔗 Connection Line */}
      {workerPos && (
        <Polyline
          positions={[userPos, workerPos]}
          pathOptions={{
            color: "blue",
            weight: 4,
            dashArray: "6",
          }}
        />
      )}

    </MapContainer>
  );
};

export default MapView;