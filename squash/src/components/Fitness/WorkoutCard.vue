<script setup lang="ts">
import { timeDifference } from '@/utils/helper';
import dayjs from 'dayjs';
import Card from 'primevue/card';
import WorkoutDot from './WorkoutDot.vue';
import { watch } from 'vue';

const props = defineProps<{
    workout: any
}>()

watch(props.workout, () => {
    console.log(props.workout)
})

</script>

<template>
    <div class='workout-wrapper'>
        <Card>
            <template #content>
                <div class='workout'>
                    <WorkoutDot :type="workout.type" />
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

    .time {
        color: var(--p-text-muted-color);
    }
}

</style>
