export default function ProgressCard({ progress }) {
  return (
    <div className="card">
      <p className="text-caption mb-2">Today's Progress</p>
      <div className="h-2 overflow-hidden rounded-pill bg-border">
        <div
          className="h-full rounded-pill bg-primary transition-[width] duration-200 ease-[ease-out]"
          style={{ width: `${progress.pct}%` }}
        />
      </div>
      <p className="text-caption mt-2">
        {progress.done}/{progress.total} completed
      </p>
    </div>
  );
}
