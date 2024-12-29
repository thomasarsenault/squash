<script setup lang="ts">
import { timeDifference } from '@/utils/helper';
import dayjs from 'dayjs';
import Card from 'primevue/card';

const props = defineProps<{
    workout: any
}>()

</script>

<template>
    <div class='workout-wrapper'>
        <Card>
            <template #content>
                <div class='workout'>
                    <div class="workout-circle" :style="{ backgroundColor: workout.color }"></div>
                    <span class="type">{{ workout.type }}</span>
                    <span class="time">({{ workout.end ? timeDifference(workout.start, workout.end) : dayjs(workout.start, 'HH:mm:ss').format('HH:mm') }})</span>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped lang="scss">
.workout-wrapper {
    cursor: pointer;
    user-select: none;
}

.workout {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &-circle {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
    }
    .time {
        color: var(--p-text-muted-color);
    }
}

</style>
