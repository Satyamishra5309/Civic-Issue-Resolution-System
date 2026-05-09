import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3">

      <h1 className="text-lg font-semibold">Admin Panel</h1>

      <div className="flex items-center gap-4">

        {/* 👤 Profile */}
        <div className="text-sm text-gray-700">
          {admin?.name || "Admin"}
        </div>

        {/* 🔴 Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Topbar;