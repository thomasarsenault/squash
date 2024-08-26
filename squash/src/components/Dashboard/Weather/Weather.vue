<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useDashboardStore } from '@/stores/dashboard';
import { onMounted, ref, computed } from 'vue';
import WeatherHour from '@/components/Dashboard/Weather/WeatherHour.vue';
import { weatherIconMapping } from '@/utils/weatherIconMapping';
import Sunset from '@/assets/weather/sunset.svg';
import Sunrise from '@/assets/weather/sunrise.svg';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const store = useDashboardStore();

onMounted(async () => {
  store.getDashboard().then(() => {
    console.log('dashboard', store.weather);
  })
})

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const selectedHourly = computed(() => store.weather.days[selectedDate.value] || {});

const sunriseHour = computed(() => dayjs(store.weather.days[selectedDate.value].sunrise).format('HHmm'));
const sunsetHour = computed(() => dayjs(store.weather.days[selectedDate.value].sunset).format('HHmm'));

</script>

<template>
    <Card>
        <template #title>
            🌅 Weather <br /><span class="relative-time">{{ dayjs(store.weather.current?.time).fromNow() }}</span>
        </template>
        <template #content v-if="Object.keys(store.weather.current).length">
            <!-- <div class="current">
            It is currently {{ store.weather.current?.temperature_2m }}°C 
            </div>  -->
            <div class="current">
            <div class="conditions">
                <span class="temperature">{{ Math.round(store.weather.current?.temperature_2m) }}°</span>
                <!-- <div class="code-label">{{ weatherIconMapping({ code: store.weather.current.weather_code}).label }}</div> -->
                <img :src="weatherIconMapping({ code: store.weather.current?.weather_code}).icon" />
            </div>
            <div class="additional-data">
                    <div class="feels-like">Feels like {{ Math.round(store.weather.current?.apparent_temperature) }}°</div>
                    <div class="humidity">{{ store.weather.current?.relative_humidity_2m }}% humidity</div>
                <div class="sunrise-sunset">
                    <div class="time"><img :src="Sunrise" />{{ dayjs(store.weather.current?.sunrise).format('HH:mm') }}</div>
                    <div class="time"><img :src="Sunset" />{{ dayjs(store.weather.current?.sunset).format('HH:mm') }}</div>
                </div>
            </div>
            </div> 

            <div class="hourly">
            <WeatherHour v-for="(hour, index) in selectedHourly.hourly"
                :hour="hour"
                :sunriseHour="sunriseHour"
                :sunsetHour="sunsetHour"
                :key="hour.time" />
            </div>

            <div class="days">
                <div v-for="(day, index) in Object.keys(store.weather.days || {})" :key="day">
                    <br />
                    <Button :severity="selectedDate === day ? 'primary': 'secondary'" outlined @click="selectedDate = day">
                        <div class="day">
                            <span class="date">{{ dayjs(day).format('ddd Do') }}</span>
                            <img :src="weatherIconMapping({ code: store.weather.days[day].weather_code}).icon" />
                            <div>
                                <span class="high">{{ store.weather.days[day].temperature_2m_max }}°</span>
                                <span class="low"> / {{ store.weather.days[day].temperature_2m_min }}°</span>
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
        </template>
        <template #content v-else>
            <Skeleton height="2rem"/>
        </template>
    </Card>
</template>

<style lang="scss" scoped>
.relative-time {
    font-size: 0.6rem;
    color: var(--p-text-muted-color);
}
.current {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding-top: 1rem;
    padding-bottom: 3rem;

    .conditions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        .temperature {
            font-size: 3rem;
        }
        img {
            width: 65px;
            height: 65px;
        }
    }

    .additional-data {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 0.5rem;
        .feels-like {
            font-size: 0.8rem;
            color: var(--p-text-muted-color);
        }

        .humidity {
            font-size: 0.8rem;
            color: var(--p-text-muted-color);
        }
    }
    
    .sunrise-sunset {
        .time {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            img {
                width: 20px;
                height: 20px;
            }
        }
    }
}

.days {
    display: flex;
    gap: 1rem;
    white-space: nowrap;
    overflow-y: auto;

    .day {
        display: flex;
        flex-direction: column;
        .high {
            font-size: 0.8rem;
            color: var(--p-text-muted-color);
        }

        .low {
            font-size: 0.6rem;
            color: var(--p-text-muted-color);
        }

        img {
            width: 65px;
            height: 65px;
        }
    }
}

.hourly {
    display: flex;
    overflow-y: auto;
    white-space: nowrap;
    gap: 1rem;
    padding: 1rem 0;
}
</style>