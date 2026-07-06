import { useEffect, useState } from "react";
import NotesInput from "./components/NotesInput";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";
import TaskEditModal from "./components/TaskEditModal";
import ExportButton from "./components/ExportButton";
import { getTasks, deleteTask, updateTask } from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ owner: "", status: "", priority: "" });
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v)
    );
    const data = await getTasks(cleanFilters);
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const handleExtracted = () => {
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleSaved = () => {
    setEditingTask(null);
    loadTasks();
  };

  // Quick status toggle from the task list (clicking the status badge)
  const handleStatusChange = async (task, newStatus) => {
    // Optimistic update so the UI feels instant
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
    try {
      await updateTask(task.id, { ...task, status: newStatus });
    } catch (err) {
      // Roll back on failure
      loadTasks();
    }
  };

  const owners = [...new Set(tasks.map((t) => t.owner).filter(Boolean))];

  return (
    <div className="min-h-screen bg-base p-6 md:p-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Mini AI Project Manager</h1>
        <p className="text-muted mt-1">Turn meeting notes into structured, trackable tasks.</p>
      </header>

      <NotesInput onExtracted={handleExtracted} />

      <div className="flex items-center justify-between mt-10 mb-4">
        <TaskFilters filters={filters} setFilters={setFilters} owners={owners} />
        <ExportButton />
      </div>

      <TaskList
        tasks={tasks}
        onEdit={setEditingTask}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}