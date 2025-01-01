import { NextResponse } from 'next/server';
// import { REFRESH_TOKEN } from '../../../../graphql/auth/auth';
// import client from '../../../../lib/apolloClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Missing refresh token' },
        { status: 400 },
      );
    }

    // const { data } = await client.mutate({
    //   mutation: REFRESH_TOKEN,
    //   variables: { refreshToken },
    // });

    // return NextResponse.json(data.refreshToken);
    return NextResponse.json({ message: 'Refresh token' });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { message: 'Failed to refresh token' },
      { status: 500 },
    );
  }
}
