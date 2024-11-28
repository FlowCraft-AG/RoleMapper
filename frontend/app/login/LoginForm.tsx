'use client';

import { useState } from 'react';
import { LoginData } from '../../lib/interfaces';
import { SubmitButton } from './LoginSubmitButton';
import Link from 'next/link';

export function LoginForm({

}: {

  }) {
  const [loginDaten, setLoginDaten] = useState<LoginData>({
    username: '',
    password: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginDaten((prevState: LoginData) => ({
      ...prevState,
      [name]: value,

    }));
  };

  return (
    <form
      className="d-flex flex-column gap-4 bg-light px-4 py-2 sm:px-4"
    >
      <div>
        <label
          htmlFor="username"
          className="d-block text-uppercase text-muted small"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="user@acme.com"
          autoComplete="username"
          required
          name="username"
          value={loginDaten.username}
          onChange={handleChange}
          className="mt-1 d-block w-100 form-control rounded border border-secondary px-3 py-2 placeholder-gray-400 shadow-sm focus:border-dark focus:outline-none focus:ring-dark form-control-sm"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="d-block text-uppercase text-muted small"
        >
          Password
        </label>
        <input
          placeholder="Password"
          value={loginDaten.password}
          onChange={handleChange}
          autoComplete="password"
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 d-block w-100 form-control rounded border border-secondary px-3 py-2 placeholder-gray-400 shadow-sm focus:border-dark focus:outline-none focus:ring-dark form-control-sm"
        />
      </div>
      <SubmitButton loginDaten={loginDaten}>Sign in</SubmitButton>
        <p className="text-center fs-6 text-muted">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">
                Sign up
            </Link>
            {' for free.'}
        </p>
    </form>
  );
}
