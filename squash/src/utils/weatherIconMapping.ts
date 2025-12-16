import Sunny from '@/assets/weather/sunny.svg';
import PartlyCloudy from '@/assets/weather/partly-cloudy.svg';
import Clouds from '@/assets/weather/clouds.svg';
import Foggy from '@/assets/weather/foggy.svg';
import Drizzle from '@/assets/weather/drizzle.svg';
import Shower from '@/assets/weather/shower.svg';
import Rain from '@/assets/weather/rain.svg';
import Snow from '@/assets/weather/snow.svg';
import Storm from '@/assets/weather/storm.svg';
import Moonlight from '@/assets/weather/moonlight.svg';
import PartlyCloudyMoon from '@/assets/weather/partly-cloudy-moon.svg';

interface mapProps {
  code: number;
  isNight?: boolean;
}

type weatherIcon = {
  label: string;
  icon: string;
};

export const weatherIconMapping = ({ code, isNight = false }: mapProps): weatherIcon => {
  return (
    {
      0: {
        label: 'Clear',
        icon: isNight ? Moonlight : Sunny,
      },
      1: {
        label: 'Mostly Clear',
        icon: isNight ? Moonlight : Sunny,
      },
      2: {
        label: 'Partly Cloudy',
        icon: isNight ? PartlyCloudyMoon : PartlyCloudy,
      },
      3: {
        label: 'Overcast',
        icon: Clouds,
      },
      45: {
        label: 'Fog',
        icon: Foggy,
      },
      48: {
        label: 'Icy Fog',
        icon: Foggy,
      },
      51: {
        label: 'Light Drizzle',
        icon: Drizzle,
      },
      53: {
        label: 'Drizzle',
        icon: Drizzle,
      },
      55: {
        label: 'Heavy Drizzle',
        icon: Drizzle,
      },
      80: {
        label: 'Light Showers',
        icon: Shower,
      },
      81: {
        label: 'Showers',
        icon: Shower,
      },
      82: {
        label: 'Heavy Showers',
        icon: Shower,
      },
      61: {
        label: 'Light Rain',
        icon: Rain,
      },
      63: {
        label: 'Rain',
        icon: Rain,
      },
      65: {
        label: 'Heavy Rain',
        icon: Rain,
      },
      56: {
        label: 'Light Icy Drizzle',
        icon: Drizzle,
      },
      57: {
        label: 'Icy Drizzle',
        icon: Drizzle,
      },
      66: {
        label: 'Light Icy Rain',
        icon: Rain,
      },
      67: {
        label: 'Icy Rain',
        icon: Rain,
      },
      77: {
        label: 'Snow Grains',
        icon: Snow,
      },
      85: {
        label: 'Light Snow Showers',
        icon: Snow,
      },
      86: {
        label: 'Snow Showers',
        icon: Snow,
      },
      71: {
        label: 'Light Snow',
        icon: Snow,
      },
      73: {
        label: 'Snow',
        icon: Snow,
      },
      75: {
        label: 'Heavy Snow',
        icon: Snow,
      },
      95: {
        label: 'Thunderstorm',
        icon: Storm,
      },
      96: {
        label: 'Heavy Thunderstorm & Light Hail',
        icon: Storm,
      },
      99: {
        label: 'Heavy Thunderstorm & Hail',
        icon: Storm,
      },
    }[code] || { label: '', icon: Sunny }
  );
};
