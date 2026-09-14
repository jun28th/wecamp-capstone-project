import React from "react";

// AC1: 3 summary cards shown above the calendar — Previous cycle length,
// Previous period length, Cycle length variation.
const StatCard = ({ label, value, unit, note, id }) => (
  <div className="card" id={id} style={{ flex: "1 1 0", minWidth: "160px" }}>
    <p
      className="text-caption"
      style={{ margin: "0 0 8px 0", color: "var(--muted)" }}
    >
      {label}
    </p>
    {value !== null ? (
      <>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-numeral)",
            lineHeight: "var(--text-numeral--line-height)",
            color: "var(--color-primary-deep)",
          }}
        >
          {value}
        </p>
        {unit && (
          <p className="text-caption" style={{ margin: "4px 0 0 0" }}>
            {unit}
          </p>
        )}
      </>
    ) : (
      <>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-numeral)",
            lineHeight: "var(--text-numeral--line-height)",
            color: "var(--color-primary-deep)",
          }}
        >
          —
        </p>
        {note && (
          <p className="text-caption" style={{ margin: "4px 0 0 0" }}>
            {note}
          </p>
        )}
      </>
    )}
  </div>
);

export const CycleStats = React.memo(({ stats }) => {
  if (!stats || !stats.hasData) return null;

  const {
    previousCycleLength,
    previousPeriodLength,
    variation,
    hasEnoughVariationData,
  } = stats;

  return (
    <div
      id="cycle-stats"
      style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        maxWidth: "640px",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "20px",
      }}
    >
      <StatCard
        id="stat-previous-cycle-length"
        label="Previous cycle length"
        value={previousCycleLength !== null ? previousCycleLength : null}
        unit="days"
      />
      <StatCard
        id="stat-previous-period-length"
        label="Previous period length"
        value={previousPeriodLength !== null ? previousPeriodLength : null}
        unit="days"
      />
      <StatCard
        id="stat-cycle-length-variation"
        label="Cycle length variation"
        value={hasEnoughVariationData ? `±${variation}` : null}
        unit={hasEnoughVariationData ? "days" : null}
        note="Needs 3+ logged cycles"
      />
    </div>
  );
});
