<script setup lang="ts">
import WeatherWidget from '@/components/Dashboard/Weather/WeatherWidget.vue';
import TasksWidget from '@/components/Dashboard/TasksWidget.vue';
import ExpensesWidget from '@/components/Dashboard/ExpensesWidget.vue';
import FitnessWidget from '@/components/Dashboard/FitnessWidget.vue';

// detect if mobile
const isMobile = window.innerWidth < 768;
</script>

<template>
  <main>
    <div class="dashboard">
      <div class="widgets">
        <div class="col">
          <WeatherWidget />
          <TasksWidget v-if="isMobile" />
          <ExpensesWidget />
        </div>
        <div class="col">
          <TasksWidget v-if="!isMobile" />
          <FitnessWidget />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard {
  .col {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: calc(50% - 1rem);

    @include breakpoint('mobile') {
      width: 100%;
      gap: 1rem;
    }
  }
}

.widgets {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 2rem;

  @include breakpoint('mobile') {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
