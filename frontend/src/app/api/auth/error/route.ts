// app/api/auth/error/route.ts
//'use client'

import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error');

  // Fehlermeldungen definieren
  const errorMessages: { [key: string]: string } = {
    'Invalid credentials': 'Invalid username or password.',
    CredentialsSignin: 'Invalid username or password.',
    NoUser: 'No user found with the provided username.',
    InvalidCredentials: 'Invalid credentials provided.',
    default: 'An unknown error occurred.',
  };

  // Fehlermeldung ermitteln
  const errorMessage =
    errorMessages[error as string] || errorMessages['default'];

  //return NextResponse.json({ error: errorMessage });
  //return NextResponse.redirect(`/login?error=${errorMessage}}`);
  redirect(`/login?error=${errorMessage}`);
  //router.push(`/login?error=${errorMessage}`);
}
