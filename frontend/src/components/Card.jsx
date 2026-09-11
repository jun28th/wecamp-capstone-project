export default function Card({ title, caption, today = false, children }) {
  const cardClass = today ? "card card-today" : "card";

  return (
    <div className={cardClass}>
      <h3 style={{ margin: "0 0 8px 0" }}>{title}</h3>
      <p className="text-caption" style={{ margin: 0 }}>
        {caption}
      </p>
      {children}
    </div>
  );
}