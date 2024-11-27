'use client';

import Link from 'next/link';
import LoginFormular from '../../components/forms/LoginFormular';
import FaceFrownIcon from '@heroicons/react/24/outline/FaceFrownIcon';

export default function Home() {
    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
        return (
            <main className="d-flex h-75 flex-column align-items-center justify-content-center gap-2">
                <FaceFrownIcon className="w-50 text-dark" />
                <h2 className="text-xl font-semibold">404 Not Found</h2>
                <p>Seite nicht verfügbar</p>
                <Link
                    href="/buecher"
                    className="mt-4 rounded bg-danger px-4 py-2 text-sm text-white"
                >
                    Zurück zu den Büchern
                </Link>
            </main>
        );
    } else {
        return (
            <main className="vh-100 d-flex justify-content-center align-items-center bg-white">
                <LoginFormular />
            </main>
        );
    }
}
