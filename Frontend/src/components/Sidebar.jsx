import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Users, MessageSquare } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Reports", path: "/reports", icon: <FileText size={18} /> },
    { name: "Teams", path: "/teams", icon: <Users size={18} /> },
    { name: "Feedback", path: "/feedback", icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="w-64 bg-white shadow-xl h-screen p-5 flex flex-col">
      
      {/* Logo */}
      <h2 className="text-2xl font-bold mb-8 text-blue-600">
        Civic Admin
      </h2>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition 
              ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;