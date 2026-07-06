import { useState } from "react";
import { extractTasks } from "../api";

export default function NotesInput({ onExtracted }) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const tasks = await extractTasks(notes);
      onExtracted(tasks);
      setNotes("");
    } catch (err) {
      setError("Couldn't extract tasks. Check the notes and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-lg">
      <h2 className="font-display text-xl font-bold text-ink mb-3">
        Paste your meeting notes
      </h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. Sarah will handle the database migration by Friday..."
        rows={6}
        className="w-full bg-base text-ink placeholder-muted rounded-xl p-4 border border-surfaceLight focus:outline-none focus:ring-2 focus:ring-accent resize-none"
      />
      {error && <p className="text-high text-sm mt-2">{error}</p>}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-4 bg-accent hover:bg-opacity-80 disabled:opacity-50 text-white font-display font-bold px-6 py-3 rounded-xl transition"
      >
        {loading ? "Extracting tasks..." : "Generate Tasks"}
      </button>
    </div>
  );
}