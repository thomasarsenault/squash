<script setup lang="ts">
import AddWorkout from '@/components/Fitness/AddWorkout.vue';
import { useFitnessStore } from '@/stores/fitness';
import { onMounted, computed } from 'vue';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import WorkoutCard from '../components/Fitness/WorkoutCard.vue';
import type { Workout } from '@/types/Fitness';

dayjs.extend(advancedFormat);

const store = useFitnessStore();

interface DateObject {
  name: string;
  date: string;
}

const last14Days: DateObject[] = [];

for (let i = 0; i < 14; i++) {
  const date = dayjs().subtract(i, 'day');
  const formattedName = date.format('dddd, Do');
  const formattedDate = date.format('YYYY-MM-DD');

  last14Days.push({
    name: formattedName,
    date: formattedDate,
  });
}

onMounted(async () => {
  store.getWorkouts().then(() => {
    console.log('workouts', store.workouts);
  })
})

const workoutsPerDay = computed(() => {
    const workouts:  { [key: string]: Workout[] } = {};

    last14Days.forEach(day => {
        workouts[day.date] = []
    })

    store.workouts.forEach((workout) => {
        if(workouts[workout.date] && workout.end) {
            workouts[workout.date].push(workout)
        }
    })

    return workouts;
})

const openAddModal = () => {
  store.modalOpen = true;
  store.editModal.open = false;
  store.editModal.workout = {} as Workout;
}

const openEditModal = (workout: any) => {
	store.editModal.workout = workout;
	store.editModal.open = true;
  store.modalOpen = true;
}

const currentWorkouts = computed(() => store.workouts.filter(workout => !workout.end));
</script>

<template>
  <main>
    <div>
        <Button label="Add Workout" @click="openAddModal"/>
    </div>
    <div v-if="currentWorkouts && currentWorkouts.length" class="current">
        <div class="label">Current workout</div>
        <WorkoutCard :key="workout.id" v-for="workout in currentWorkouts" :workout="workout" @click="() => openEditModal(workout)"/>
    </div>
    <div v-for="(day, date) in workoutsPerDay" :key="date" class="day">
        <div class='label'>{{ dayjs(date).format('dddd, Do') }}</div>
        <WorkoutCard v-for="workout in day" :key="workout.id" :workout="workout" @click="() => openEditModal(workout)"/>
    </div>
    <AddWorkout id="add-workout-modal" />
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.current {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.day {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.label {
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
}


</style>