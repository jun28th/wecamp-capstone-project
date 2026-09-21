import { useState } from "react";
import Button from "@common/Button";
import PillButton from "@common/PillButton";
import FormField from "./FormField";
import RowActionButton from "./RowActionButton";

const REWARD_TEXT_MAX_LENGTH = 255;

function validateReward(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    return "Reward cannot be empty";
  }
  if (trimmed.length > REWARD_TEXT_MAX_LENGTH) {
    return `Reward must be at most ${REWARD_TEXT_MAX_LENGTH} characters`;
  }
  return null;
}

export default function GoalCard({ goal, unlocked, onSave, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [rewardText, setRewardText] = useState("");
  const [rewardError, setRewardError] = useState(null);

  function openForm() {
    setRewardText(goal?.rewardText ?? "");
    setRewardError(null);
    setEditing(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const error = validateReward(rewardText);
    if (error) {
      setRewardError(error);
      return;
    }

    setRewardError(null);
    onSave(rewardText.trim());
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="card">
        <form onSubmit={handleSubmit}>
          <FormField
            id="reward-input"
            label="Reward"
            className="mb-3"
            type="text"
            placeholder="e.g. Watch a movie tonight"
            value={rewardText}
            maxLength={REWARD_TEXT_MAX_LENGTH}
            onChange={(event) => setRewardText(event.target.value)}
            error={rewardError}
            autoFocus
          />
          <div className="flex justify-end gap-2.5">
            <PillButton type="button" onClick={() => setEditing(false)}>
              Cancel
            </PillButton>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="card cursor-pointer" onClick={openForm}>
        <p className="text-[15px] font-semibold text-primary-deep">
          + Set today's goal / reward
        </p>
        <p className="text-caption mt-1">
          Give yourself something to look forward to once every task is done.
        </p>
      </div>
    );
  }

  return (
    <div className={unlocked ? "card border-[1.5px] border-gold" : "card"}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 text-[22px]">{unlocked ? "🎁" : "🔒"}</span>
          <div className="min-w-0">
            <p className="text-caption">Today's Goal</p>
            <p className="mt-0.5 text-[16px] font-semibold text-ink wrap-anywhere [word-break:break-word]">
              {goal.rewardText}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <RowActionButton tone="edit" onClick={openForm}>
            Edit
          </RowActionButton>
          <RowActionButton tone="delete" onClick={onRemove}>
            Remove
          </RowActionButton>
        </div>
      </div>
      <p className="text-caption mt-2">
        {unlocked ? "Unlocked — enjoy your reward!" : "Locked — complete all tasks to unlock"}
      </p>
    </div>
  );
}