<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { onMounted, ref, computed } from 'vue';
import { useFitnessStore } from '@/stores/fitness';
import type { Workout } from '@/types/Fitness';
import WorkoutCalendar from '../Fitness/WorkoutCalendar.vue';
import DashboardWidget from './DashboardWidget.vue';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

interface DateObject {
  name: string;
  date: string;
}

const store = useFitnessStore();

onMounted(async () => {
	store.getWorkouts().then(() => {
		console.log('tasks', store.workouts);
	})
})

// TODO: could be shared w/ FitnessView
const last5Days: DateObject[] = [];

for (let i = 0; i < 5; i++) {
  const date = dayjs().subtract(i, 'day');
  const formattedName = date.format('dddd, Do');
  const formattedDate = date.format('YYYY-MM-DD');

  last5Days.push({
    name: formattedName,
    date: formattedDate,
  });
}

const workoutsPerDay = computed(() => {
    const workouts: { [key: string]: Workout[] } = {};

    last5Days.forEach(day => {
        workouts[day.date] = [];
    })

    store.workouts.forEach((workout) => {
        if(workouts[workout.date] && workout.end) {
            workouts[workout.date].push(workout)
        }
    })

    return workouts;
})

</script>

<template>
	<DashboardWidget title="Fitness" to="/fitness" icon="wave-pulse">
		<div class="calendar">
			<WorkoutCalendar :workouts="store.workouts" :readOnly="true"/>
		</div>
	</DashboardWidget>
</template>

<style lang="scss" scoped>
.calendar {
    :deep(.p-card) {
        box-shadow: none;
    }

    :deep(.p-card-body) {
        padding: 1rem 0 0 0;
    }

    :deep(.p-card-caption) {
        display: none;
    }
}
</style>