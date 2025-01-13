<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { onMounted, ref, computed } from 'vue';
import { useFitnessStore } from '@/stores/fitness';
import type { Workout } from '@/types/Fitness';
import WorkoutCalendar from '../Fitness/WorkoutCalendar.vue';

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
	<Card>
		<template #title>
			<div class="title">
                <span>🏋️ Gym</span>
                <RouterLink :to="'/fitness'">
                    <Button severity="secondary" label="View" />
                </RouterLink>
            </div>
		</template>
		<template #content>
            <div class="calendar">
                <WorkoutCalendar :workouts="store.workouts" :readOnly="true"/>
            </div>
            <!-- <div class="workouts">
                <div v-for="(day, date) in workoutsPerDay" :key="date" class="day">
                    <div class='label'>{{ dayjs(date).format('dddd, Do') }}</div>
                    <WorkoutCard v-for="workout in day" :key="workout.id" :workout="workout" />
                </div>
            </div> -->
		</template>
	</Card>
</template>

<style lang="scss" scoped>
.title {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.calendar {
    :deep(.p-card) {
        box-shadow: none;
    }

    :deep(.p-card-body) {
        padding: 0;
    }
}

// .workouts {
//     display: flex;
//     justify-content: space-between;
//     margin-top: 1rem;
//     .day {
//         display: flex;
//         flex-direction: column;
//         gap: 0.5rem;
//         :deep(.p-card) {
//             box-shadow: none;
//             padding: 0;
//         }

//         :deep(.p-card-body) {
//             padding: 0.5rem 0;
//         }
//     }

//     @include breakpoint('mobile') {
//         flex-direction: column;
//         gap: 1rem;
//     }

// }

// .label {
//     font-size: 0.75rem;
//     color: var(--p-text-muted-color);
// }


</style>