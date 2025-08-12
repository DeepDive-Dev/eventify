import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json({ error: 'Location parameter is required' }, { status: 400 });
    }

    // Add a User-Agent header to comply with Nominatim's usage policy
    const headers = new Headers();
    headers.append('User-Agent', 'EventifyApp/1.0 (youremail@example.com)'); // It's good practice to identify your app

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
      { headers: headers }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Geocoding API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch coordinates' }, { status: 500 });
  }
}