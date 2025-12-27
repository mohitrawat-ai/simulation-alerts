import { NextResponse } from 'next/server';

export async function GET() {
  throw new Error('Frontend API test error for Sentry monitoring!');

  // This line will never execute, but TypeScript needs a return type
  return NextResponse.json({ message: 'This should not be reached' });
}
