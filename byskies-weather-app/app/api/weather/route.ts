import { NextResponse } from 'next/server';
import { getCurrentWeather, getForecast } from '@/lib/weather-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    return NextResponse.json(
      { error: 'Latitude and longitude must be numbers' },
      { status: 400 }
    );
  }

  try {
    const [currentWeather, forecast] = await Promise.all([
      getCurrentWeather(latNum, lonNum),
      getForecast(latNum, lonNum),
    ]);

    return NextResponse.json({ currentWeather, forecast });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
