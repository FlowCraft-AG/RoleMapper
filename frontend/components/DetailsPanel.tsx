// components/DetailsPanel.tsx
interface DetailsPanelProps {
  title: string;
  details: Record<string, string | number>;
}

export default function DetailsPanel({ title, details }: DetailsPanelProps) {
  return (
    <div style={{ padding: '1rem', borderLeft: '1px solid #ddd' }}>
      <h3>{title}</h3>
      <ul>
        {Object.entries(details).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
