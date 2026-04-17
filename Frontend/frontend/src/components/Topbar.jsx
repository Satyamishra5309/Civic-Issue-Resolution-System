const Topbar = () => {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
          A
        </div>
        <span className="text-gray-600">Admin</span>
      </div>
    </div>
  );
};

export default Topbar;