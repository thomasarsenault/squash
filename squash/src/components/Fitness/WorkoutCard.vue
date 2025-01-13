<script setup lang="ts">
import { timeDifference } from '@/utils/helper';
import dayjs from 'dayjs';
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
    <Button severity="secondary" class="workout-button">
        <div class='workout'>
            <div class="type">
                <WorkoutDot :type="workout.type" />
                <span>{{ workout.type }}</span>
            </div>
            <span class="time">({{ workout.end ? timeDifference(workout.start, workout.end) : dayjs(workout.start, 'HH:mm:ss').format('HH:mm') }})</span>
        </div>
    </Button>
</template>

<style scoped lang="scss">
.workout-button {
    justify-content: space-between;
}

.workout {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;

    .type {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .time {
        color: var(--p-text-muted-color);
    }
}

</style>
