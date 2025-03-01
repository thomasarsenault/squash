<script setup lang="ts">
import WeatherWidget from '@/components/Dashboard/Weather/WeatherWidget.vue';
import TasksWidget from '@/components/Dashboard/TasksWidget.vue';
import ExpensesWidget from '@/components/Dashboard/ExpensesWidget.vue';
import FitnessWidget from '@/components/Dashboard/FitnessWidget.vue';
</script>

<!-- TODO: move cards to individual components -->
<template>
  <main>
    <div class="dashboard">
        <div class="widgets">
            <div class="weather">
                <WeatherWidget />
            </div>
            <div class="tasks">
                <TasksWidget />
            </div>
            <div class="group">
                <div class="expenses">
                    <ExpensesWidget />
                </div>
                <div class="fitness">
                    <FitnessWidget />
                </div>
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
    .weather {
        width: 100%;
    }

    .tasks {
        width: 440px;

        @include breakpoint('mobile') {
            width: 100%;
        }
    }

    .group {
        flex-grow: 1;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
}

.widgets {
    display: flex;
    gap: 2rem;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;

    @include breakpoint('mobile') {
        flex-direction: column;
    }
}
</style>