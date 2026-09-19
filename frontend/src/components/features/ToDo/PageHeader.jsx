import { todayEyebrow } from "@utils/calendar.utils";

function PageHeader() {
  return (
    <header className="my-6">
      <p className="mb-1 text-[13px] text-muted">{todayEyebrow()}</p>
      <h1>Today's Tasks</h1>
    </header>
  );
}

export default PageHeader;
