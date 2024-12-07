'use client';

import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { LoadingComponent } from '../../components/LoadingIndicator';
import { ErrorBanner } from '../../components/ErrorBanner';
import { signIn } from 'next-auth/react';

export function SubmitButton({ children, loginDaten }: { children: React.ReactNode, loginDaten: any}) {
  const { pending } = useFormStatus();

  const [isInputValid, setIsInputValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsInputValid(loginDaten.username !== '' && loginDaten.password !== '');
     const errorFromUrl = new URLSearchParams(window.location.search).get('error');
    if (errorFromUrl) {
      setError(decodeURIComponent(errorFromUrl));
    }
  }, [loginDaten]);

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    //event.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      const { username, password } = loginDaten;
      //const authData = getAuth(username, password)

      await signIn('credentials', {
        username,
        password,
        redirect: true,
        callbackUrl: '/profile',
      });
    } catch (error) {
      console.error('Sign-in error: %s', error); // Handle sign-in error
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <>
    {isLoading && (
          <LoadingComponent
            message={'Sie werden angemeldet. Haben Sie Geduld.'}
          />
        )}

    <button
      type={pending ? 'button' : 'submit'}
      onClick={handleLogin}
      disabled={!isInputValid || isLoading}
      aria-disabled={pending}
      className="d-flex w-100 align-items-center justify-content-center rounded border text-sm transition-all focus:outline-none"
    >
      {children}
      {pending && (
        <svg
          className="spinner-border text-dark ms-2 h-25 w-25"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      <span aria-live="polite" className="visually-hidden" role="status">
        {pending ? 'Loading' : 'Submit form'}
      </span>
      </button>
      {error && <ErrorBanner message={error} />}
      </>
  );
}
