export default function ExportButton() {
  const exportUrl = "http://localhost:8000/tasks/export";

  return (
    <a
      href={exportUrl}
      download
      className="flex items-center gap-2 bg-surfaceLight hover:bg-accent hover:text-white text-ink text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 border border-surfaceLight hover:border-accent"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export CSV
    </a>
  );
}