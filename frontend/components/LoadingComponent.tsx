import React from 'react';

type Props = {
    message?: string;
};

export const LoadingComponent: React.FC<Props> = ({ message }) => {
    const loadingText = message ?? 'Wird geladen';

    return (
        <div className="d-flex justify-content-center">
            <div role="status" className=" text-dark spinner-border">
                <span className="sr-only">{loadingText}</span>
            </div>
        </div>
    );
};
