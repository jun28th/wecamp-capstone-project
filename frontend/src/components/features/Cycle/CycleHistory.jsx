import { formatDateWithYear, getDayCount } from "@utils/calendar.utils";

export const CycleHistory = ({ cycleLogs }) => {
  const validCycles = cycleLogs.filter((c) => c.startDate && c.endDate);

  return (
    <section data-od-id="cycle-history-section">
      <h2 className="my-6">Period History</h2>
      <div
        className="bg-[var(--surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-1)] p-5"
        id="cycle-history"
      >
        {validCycles.length > 0 ? (
          validCycles.map((cycle, index) => (
            <div
              key={cycle.id ?? `${cycle.startDate}-${cycle.endDate}`}
              className={`flex items-center justify-between py-3 border-[var(--border)] ${
                index === validCycles.length - 1 ? "" : "border-b-[1px]"
              }`}
            >
              <div className="text-[15px] text-[var(--color-ink)]">
                {formatDateWithYear(cycle.startDate)} —{" "}
                {formatDateWithYear(cycle.endDate)}
              </div>
              <div className="text-[13px] font-semibold text-[var(--muted)]">
                {getDayCount(cycle.startDate, cycle.endDate)} days
              </div>
            </div>
          ))
        ) : (
          <div className="text-center px-8 py-5">
            <div className="text-[32px] opacity-[0.35] mb-3">📈</div>
            <p className="text-caption">
              There is no cycle data yet. Please update your cycle regularly to
              track it.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};