'use client';
import React from 'react';

type Props = {
    message: string;
};

export const ErrorBannerComponent: React.FC<Props> = ({ message }) => {
    return (
        <div role="alert" className="alert alert-danger">
            {message}
        </div>
    );
};
