import React from 'react';

type Props = {
  message?: string; // Optionaler Nachrichtentext, der angezeigt werden soll
};

export const LoadingComponent = ({ message }: Props) => {
  const loadingText = message ?? "Wird geladen"; // Fallback-Text, wenn keine Nachricht bereitgestellt wird

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div role="status" className="spinner-border" aria-label={loadingText}>
        <span className="visually-hidden">{loadingText}</span>
      </div>
    </div>
  );
};
