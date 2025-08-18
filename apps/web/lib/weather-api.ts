export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface ApiError {
  cod: string;
  message: string;
}

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
}

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API key is not set.");
  }
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  return fetcher<WeatherData>(url);
}

export async function getForecast(city: string): Promise<ForecastData> {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API key is not set.");
  }
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  return fetcher<ForecastData>(url);
}

export function getSuggestedActivities(weather: WeatherData): string[] {
  const suggestions: string[] = [];
  const temp = weather.main.temp;
  const description = weather.weather[0].description.toLowerCase();

  if (temp > 25 && !description.includes("rain")) {
    suggestions.push("Go for a swim 🏊");
    suggestions.push("Have a picnic 🧺");
  } else if (temp > 15 && !description.includes("rain")) {
    suggestions.push("Go for a walk 🚶");
    suggestions.push("Visit a park 🌳");
  } else if (temp < 10 || description.includes("snow")) {
    suggestions.push("Stay indoors and read a book 📚");
    suggestions.push("Watch a movie 🎬");
  } else if (description.includes("rain")) {
    suggestions.push("Play board games 🎲");
    suggestions.push("Visit a museum 🏛️");
  } else {
    suggestions.push("Check local events 🎉");
  }

  return suggestions;
}
