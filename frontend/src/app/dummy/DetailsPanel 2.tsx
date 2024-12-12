export default function DetailsPanel({ title, details }: { title: string; details: any }) {
  const renderDetails = (obj: Record<string, any>) => (
    <ul>
      {Object.entries(obj).map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return (
            <li key={key}>
              <strong>{key}:</strong>
              {renderDetails(value)}
            </li>
          );
        }
        return (
          <li key={key}>
            <strong>{key}:</strong> {String(value)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div style={{ padding: "1rem", borderLeft: "1px solid #ddd" }}>
      <h3>{title}</h3>
      {renderDetails(details)}
    </div>
  );
}
