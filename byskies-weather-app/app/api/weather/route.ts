import { NextResponse } from 'next/server';
import type { WeatherData } from '@/types/weather';

export async function GET() {
  const data: WeatherData = {
    temperature: 75,
    condition: 'sunny',
    location: 'San Francisco, CA',
  };

  return NextResponse.json(data);
}
