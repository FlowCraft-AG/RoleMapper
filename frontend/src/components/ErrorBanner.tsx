'use client';
import React from 'react';

type Props = {
    message: string;
    className?: string; // Ermöglicht zusätzliches Styling durch die Klasse
};

export const ErrorBanner: React.FC<Props> = ({ message, className = '' }) => {
    return (
        <div
            role="alert"
            className={`alert alert-danger ${className}`} // Ermöglicht zusätzliche Klassen für benutzerdefiniertes Styling
        >
            {message}
        </div>
    );
};
