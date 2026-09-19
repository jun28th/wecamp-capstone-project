import { todayEyebrow } from "@utils/calendar.utils";

function PageHeader() {
  return (
    <header className="app-header">
      <p className="eyebrow">{todayEyebrow()}</p>
      <h1>Today's Tasks</h1>
    </header>
  );
}

export default PageHeader;
