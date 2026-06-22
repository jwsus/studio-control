export function Metric(props: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "green" | "blue" | "amber" | "violet";
}) {
  return (
    <div className={`metric-card ${props.color}`}>
      <div className="metric-icon">{props.icon}</div>
      <div>
        <span>{props.label}</span>
        <strong>{props.value}</strong>
      </div>
    </div>
  );
}
