'use client';

import { useEffect, useState } from 'react';
import { LoginDaten } from '../../lib/interfaces';
import { LoadingComponent } from '../LoadingComponent';
import { ErrorBannerComponent } from '../ErrorBannerComponent';
import { useRouter } from 'next/navigation';
import { getAuth } from '../../api/auth';

export default function LoginForm() {
    const [loginDaten, setLoginDaten] = useState<LoginDaten>({
        username: '',
        password: '',
    });

    const [isInputValid, setIsInputValid] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const router = useRouter();

    // Validate input whenever loginDaten changes
    useEffect(() => {
        setIsInputValid(
            loginDaten.username !== '' && loginDaten.password !== '',
        );
    }, [loginDaten]);

    // Handle login button click
    const handleLogin = async () => {
        setIsLoading(true);
        setError(undefined);

        try {
            const { username, password } = loginDaten;
            const token = await getAuth(username, password);
            if (token) {
                localStorage.setItem('token', token.access_token);
                localStorage.setItem('refreshToken', token.refresh_token);
                localStorage.setItem('expires_in', token.expires_in);
            } else {
                console.error('Error: Token is undefined.');
            }
            localStorage.setItem(
                'token_timestamp',
                Math.floor(Date.now() / 1000).toString(),
            );
            localStorage.setItem('user', username);
            setTimeout(() => {
                router.push('/buecher');
                router.refresh();
            }, 125);
        } catch (err) {
            setTimeout(() => {
                setError((err as Error).message);
            }, 125);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 125);
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginDaten((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <form className="p-3 w-50 bg-white border border-danger rounded shadow">
            <h1 className="display-6 mb-3 text-dark">Login</h1>
            <div className="form-floating mb-3 text-dark">
                <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="username"
                    value={loginDaten.username}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating text-dark">
                <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    value={loginDaten.password}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            {isLoading && (
                <LoadingComponent
                    message={'Sie werden angemeldet. Haben Sie Geduld.'}
                />
            )}
            {error && <ErrorBannerComponent message={error} />}
            <button
                type="button"
                className="btn btn-danger mt-3"
                onClick={handleLogin}
                disabled={!isInputValid || isLoading}
            >
                Sign in
            </button>
        </form>
    );
}
