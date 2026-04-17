const Filters = ({ setSearch, setStatus }) => {
  return (
    <div className="flex gap-4 mb-4">
      
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded w-1/3"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Status Filter */}
      <select
        className="border p-2 rounded"
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
};

export default Filters;