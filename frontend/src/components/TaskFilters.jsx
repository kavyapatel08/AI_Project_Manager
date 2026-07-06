export default function TaskFilters({ filters, setFilters, owners }) {
  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select
        value={filters.owner}
        onChange={(e) => update("owner", e.target.value)}
        className="bg-surface text-ink rounded-lg px-3 py-2 border border-surfaceLight focus:outline-none"
      >
        <option value="">All Owners</option>
        {owners.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => update("status", e.target.value)}
        className="bg-surface text-ink rounded-lg px-3 py-2 border border-surfaceLight focus:outline-none"
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => update("priority", e.target.value)}
        className="bg-surface text-ink rounded-lg px-3 py-2 border border-surfaceLight focus:outline-none"
      >
        <option value="">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
}