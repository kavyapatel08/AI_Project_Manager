import { useState } from "react";
import { updateTask } from "../api";

export default function TaskEditModal({ task, onClose, onSaved }) {
  const [form, setForm] = useState({ ...task });
  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const updated = await updateTask(task.id, form);
    onSaved(updated);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-display text-lg font-bold text-ink mb-4">Edit Task</h3>

        <label className="text-muted text-sm">Task</label>
        <input
          value={form.task}
          onChange={(e) => handleChange("task", e.target.value)}
          className="w-full bg-base text-ink rounded-lg p-2 mb-3 border border-surfaceLight"
        />

        <label className="text-muted text-sm">Owner</label>
        <input
          value={form.owner || ""}
          onChange={(e) => handleChange("owner", e.target.value)}
          className="w-full bg-base text-ink rounded-lg p-2 mb-3 border border-surfaceLight"
        />

        <label className="text-muted text-sm">Due Date</label>
        <input
          type="date"
          value={form.due_date || ""}
          onChange={(e) => handleChange("due_date", e.target.value)}
          className="w-full bg-base text-ink rounded-lg p-2 mb-3 border border-surfaceLight"
        />

        <label className="text-muted text-sm">Priority</label>
        <select
          value={form.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
          className="w-full bg-base text-ink rounded-lg p-2 mb-3 border border-surfaceLight"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label className="text-muted text-sm">Status</label>
        <select
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full bg-base text-ink rounded-lg p-2 mb-4 border border-surfaceLight"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-muted hover:text-ink px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}