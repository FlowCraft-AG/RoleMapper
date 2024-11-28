import { NextResponse } from 'next/server';

let refreshing = false;

export async function POST(req: Request) {
  const { action } = await req.json();

  if (action === 'refresh') {
    refreshing = true;
    console.log('Token refresh initiated');
    
    return NextResponse.json({ message: 'Refreshing started' });
  }

  return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
}

export function getRefreshingStatus() {
  return refreshing;
}

export function setRefreshingStatus(status: boolean) {
  refreshing = status;
}
