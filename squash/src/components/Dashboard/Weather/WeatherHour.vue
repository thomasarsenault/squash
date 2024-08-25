<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import { weatherIconMapping } from '@/utils/weatherIconMapping';

const props = defineProps<{
  hour: any,
  sunriseHour: string,
  sunsetHour: string
}>()

const now = false;

const isNight = computed(() => {
    const now = dayjs(props.hour.time).format('HHmm');

    return now > props.sunsetHour || now < props.sunriseHour;
});

const icon = computed(() => weatherIconMapping({ code: props.hour.weather_code, isNight: isNight.value}));
console.log(icon.value);
</script>

<template>
    <div :class="`hour ${now ? 'now' : ''}`">
        <div class="time">{{ now ? 'Now' : dayjs(hour.time).format('h a') }}</div>
        <img :src="icon.icon" />
        <div v-if="hour.weather_code > 48" class="rain-data">
            <div class="precipitation">{{ hour.precipitation }}mm</div>
            <div class="precipitation_prob">{{ hour.precipitation_probability }}%</div>
        </div>
        <div class="temperature">
            {{ hour.temperature_2m }}°
            <!-- <span class="feels-like">| {{ hour.apparent_temperature }}°</span> -->
        </div>
        <!-- <div class="humidity">{{ hour.relative_humidity_2m }}%</div> -->
    </div>
</template>

<style lang="scss" scoped>
.hour {
    display: flex;
    flex-direction: column;
    align-items: center;

    .time {
        font-size: 0.8rem;
        color: var(--text-secondary-color);
    }
    .feels-like {
        font-size: 0.6rem;
        color: var(--text-secondary-color);
    }

    .rain-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        div {
            font-weight: bold;
        }
    }
    
    &.now {
    }

    img {
        width: 40px;
        height: 40px;
    }
}
</style>