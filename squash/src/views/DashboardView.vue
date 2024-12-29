<script setup lang="ts">
import Weather from '@/components/Dashboard/Weather/Weather.vue';
import Tasks from '@/components/Dashboard/Tasks.vue';
import Expenses from '@/components/Dashboard/Expenses.vue';
import Fitness from '@/components/Dashboard/Fitness.vue';
</script>

<!-- TODO: move cards to individual components -->
<template>
  <main>
    <div class="dashboard">
        <div class="widgets">
            <div class="weather">
                <Weather />
            </div>
            <div class="tasks">
                <Tasks />
            </div>
            <div class="group">
                <div class="expenses">
                    <Expenses />
                </div>
                <div class="fitness">
                    <Fitness />
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
        gap: 1rem;
    }
}

.widgets {
    display: flex;
    gap: 1rem;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;

    @include breakpoint('mobile') {
        flex-direction: column;
    }
}
</style>