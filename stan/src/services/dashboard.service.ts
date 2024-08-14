import dayjs from 'dayjs';

const getWeather = async (): Promise<any> => {
    const baseUrl = "https://api.open-meteo.com/v1/forecast";

    const weatherParams = {
        latitude: 43.661143,
        longitude: -79.382736,
        currentParams: ["temperature_2m", "wind_speed_10m", "apparent_temperature", "precipitation_probability", "weather_code", "relative_humidity_2m"],
        hourlyParams: ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "apparent_temperature", "precipitation", "precipitation_probability", "weather_code"],
        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "precipitation_hours", "precipitation_probability_max", "sunrise", "sunset"],
        timezone: "America/New_York",
        forecast_days: 14
    };

    const params = new URLSearchParams({
        latitude: weatherParams.latitude.toString(),
        longitude: weatherParams.longitude.toString(),
        current: weatherParams.currentParams.join(","),
        hourly: weatherParams.hourlyParams.join(","),
        timezone: weatherParams.timezone,
        daily: weatherParams.daily.join(","),
        forecast_days: weatherParams.forecast_days.toString()
    });
  
    const url = `${baseUrl}?${params.toString()}`;
  
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }

      const data = await response.json();



      return { weather: transformWeatherData(data) };
    } catch (error) {
        throw error;
    }
};

function transformWeatherData(data: any) {
    const transformedData: any = {
      current: data.current,
      days: {}
    };
  
    const times: any[] = data.hourly.time;

    console.log(data.daily)
    data.daily.time.forEach((date: any, index: number) => {
        transformedData.days[date] = {};

        transformedData.days[date].weather_code = data.daily.weather_code[index];
        transformedData.days[date].temperature_2m_max = Math.round(data.daily.temperature_2m_max[index]);
        transformedData.days[date].temperature_2m_min = Math.round(data.daily.temperature_2m_min[index]);
        transformedData.days[date].apparent_temperature_max = Math.round(data.daily.apparent_temperature_max[index]);
        transformedData.days[date].apparent_temperature_min = Math.round(data.daily.apparent_temperature_min[index]);
        transformedData.days[date].precipitation_hours = data.daily.precipitation_hours[index];
        transformedData.days[date].precipitation_probability_max = data.daily.precipitation_probability_max[index];
        transformedData.days[date].sunrise = data.daily.sunrise[index];
        transformedData.days[date].sunset = data.daily.sunset[index];
        transformedData.days[date].hourly = [];
    });

    times.forEach((time, index) => {
        const date = time.split('T')[0];

        transformedData.days[date].hourly.push({
            time,
            temperature_2m: Math.round(data.hourly.temperature_2m[index]),
            apparent_temperature: Math.round(data.hourly.apparent_temperature[index]),
            relative_humidity_2m: data.hourly.relative_humidity_2m[index],
            wind_speed_10m: data.hourly.wind_speed_10m[index],
            precipitation: data.hourly.precipitation[index],
            precipitation_probability: data.hourly.precipitation_probability[index],
            weather_code: data.hourly.weather_code[index]
        });
    });
  
    const keys = Object.keys(transformedData.days);
    transformedData.days[keys[0]].hourly = [...transformedData.days[keys[0]].hourly, ...transformedData.days[keys[1]].hourly].filter(day => dayjs(day.time).isAfter(dayjs().subtract(1, 'hour')));
    return transformedData;
  }


export default {
    getWeather
};