export default function ProgressCard({ progress }) {
  return (
    <div className="card">
      <p className="text-caption" style={{ margin: "0 0 8px 0" }}>
        Today's Progress
      </p>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress.pct}%` }} />
      </div>
      <p className="text-caption" style={{ margin: "8px 0 0 0" }}>
        {progress.done}/{progress.total} completed
      </p>
    </div>
  );
}
