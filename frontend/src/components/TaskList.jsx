const priorityColor = {
  High: "border-high",
  Medium: "border-medium",
  Low: "border-low",
};

const priorityBadge = {
  High: "bg-high/20 text-high",
  Medium: "bg-medium/20 text-medium",
  Low: "bg-low/20 text-low",
};

const statusBadge = {
  Pending: "bg-muted/20 text-muted",
  "In Progress": "bg-medium/20 text-medium",
  Done: "bg-low/20 text-low",
};

// Clicking the status badge cycles through this order
const nextStatus = {
  Pending: "In Progress",
  "In Progress": "Done",
  Done: "Pending",
};

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted py-16">
        No tasks yet — paste some notes above to generate your first batch.
      </div>
    );
  }

  const handleDelete = (id, taskName) => {
    const confirmed = window.confirm(`Delete "${taskName}"? This can't be undone.`);
    if (confirmed) onDelete(id);
  };

  return (
    <div className="grid gap-3">
      {tasks.map((t, i) => {
        const isDone = t.status === "Done";
        return (
          <div
            key={t.id}
            className={`task-enter bg-surface border-l-4 ${
              priorityColor[t.priority] || "border-muted"
            } rounded-xl p-4 flex items-center justify-between gap-4 transition-opacity ${
              isDone ? "opacity-60" : ""
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex-1 min-w-0">
              <p
                className={`text-ink font-medium truncate ${
                  isDone ? "line-through text-muted" : ""
                }`}
              >
                {t.task}
              </p>
              <div className="flex gap-3 mt-1 text-sm text-muted flex-wrap">
                <span>{t.owner || "Unassigned"}</span>
                <span>•</span>
                <span>{t.due_date || "No due date"}</span>
              </div>
            </div>

            <button
              onClick={() => onStatusChange(t, nextStatus[t.status] || "Pending")}
              title="Click to change status"
              className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap hover:brightness-125 transition ${
                statusBadge[t.status] || "bg-muted/20 text-muted"
              }`}
            >
              {t.status}
            </button>

            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                priorityBadge[t.priority] || "bg-muted/20 text-muted"
              }`}
            >
              {t.priority}
            </span>

            <button
              onClick={() => onEdit(t)}
              className="text-accent hover:text-white text-sm font-medium whitespace-nowrap"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(t.id, t.task)}
              className="text-high hover:text-red-400 text-sm font-medium whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}