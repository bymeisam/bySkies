// TypeScript interfaces for OpenWeatherMap Air Pollution API

export interface AirPollutionMain {
  aqi: number;
}

export interface AirPollutionComponents {
  co: number;
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
}

export interface AirPollutionListItem {
  main: AirPollutionMain;
  components: AirPollutionComponents;
}

export interface AirPollutionResponse {
  coord: {
    lat: number;
    lon: number;
  };
  list: AirPollutionListItem[];
}
