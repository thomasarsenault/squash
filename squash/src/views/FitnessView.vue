<script setup lang="ts">
import AddWorkout from '@/components/Fitness/AddWorkout.vue';
import { useFitnessStore } from '@/stores/fitness';
import { onMounted, computed } from 'vue';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import WorkoutCalendar from '@/components/Fitness/WorkoutCalendar.vue';
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
  });
});

const openAddModal = () => {
  store.dayModal.date = dayjs();
  store.modalOpen = true;
  store.editModal.open = false;
  store.editModal.workout = {} as Workout;
};
</script>

<template>
  <main>
    <div class="content">
      <div class="calendar">
        <WorkoutCalendar :workouts="store.workouts" />
      </div>
    </div>
    <div class="actions">
      <Button severity="secondary" label="Add Workout" @click="openAddModal" />
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

.actions {
  width: 100%;
  display: flex;
  justify-content: center;
}

.content {
  display: flex;
  width: 100%;
  gap: 1rem;

  @include breakpoint('mobile') {
    flex-direction: column;
    gap: 1rem;
  }
}

.calendar {
  width: 100%;
}

.workout-list {
  width: 40%;

  @include breakpoint('mobile') {
    width: 100%;
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
    margin-bottom: 2rem;

    .label {
      font-size: 0.75rem;
      color: var(--p-text-muted-color);
    }
  }
}
</style>
