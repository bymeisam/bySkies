// Open-Meteo API client configuration

export const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1';

export interface OpenMeteoRequestParams {
  latitude: number;
  longitude: number;
  [key: string]: string | number | boolean;
}

export class OpenMeteoAPIError extends Error {
  constructor(message: string, public status?: number, public response?: any) {
    super(message);
    this.name = 'OpenMeteoAPIError';
  }
}

export async function makeOpenMeteoRequest<T>(
  endpoint: string,
  params: OpenMeteoRequestParams
): Promise<T> {
  const url = new URL(`${OPENMETEO_BASE_URL}${endpoint}`);
  
  // Add parameters to URL
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new OpenMeteoAPIError(
        `Open-Meteo API request failed: ${response.status} ${response.statusText}`,
        response.status,
        errorText
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof OpenMeteoAPIError) {
      throw error;
    }
    throw new OpenMeteoAPIError(
      `Open-Meteo API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      error
    );
  }
}