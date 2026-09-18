import { useState } from "react";

export default function GoalCard({ goal, unlocked, onSave, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [rewardText, setRewardText] = useState("");

  function openForm() {
    setRewardText(goal?.rewardText ?? "");
    setEditing(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!rewardText.trim()) return;
    onSave(rewardText.trim());
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-field" style={{ marginBottom: "12px" }}>
            <label htmlFor="reward-input">Reward</label>
            <input
              id="reward-input"
              type="text"
              placeholder="e.g. Watch a movie tonight"
              value={rewardText}
              onChange={(event) => setRewardText(event.target.value)}
              autoFocus
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="card" onClick={openForm} style={{ cursor: "pointer" }}>
        <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "var(--color-primary-deep)" }}>
          + Set today's goal / reward
        </p>
        <p className="text-caption" style={{ margin: "4px 0 0 0" }}>
          Give yourself something to look forward to once every task is done.
        </p>
      </div>
    );
  }

  return (
    <div className={unlocked ? "card reward-card-unlocked" : "card"}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <span style={{ fontSize: "22px", flexShrink: 0 }}>{unlocked ? "🎁" : "🔒"}</span>
          <div style={{ minWidth: 0 }}>
            <p className="text-caption" style={{ margin: 0 }}>
              Today's Goal
            </p>
            <p
              style={{
                margin: "2px 0 0 0",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--color-ink)",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {goal.rewardText}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
          <button className="todo-action-btn edit" onClick={openForm}>
            Edit
          </button>
          <button className="todo-action-btn delete" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
      <p className="text-caption" style={{ margin: "8px 0 0 0" }}>
        {unlocked ? "Unlocked — enjoy your reward!" : "Locked — complete all tasks to unlock"}
      </p>
    </div>
  );
}
