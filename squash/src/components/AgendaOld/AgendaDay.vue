<script setup lang="ts">
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat';;
import { computed, toRaw } from 'vue';
import { useTasksStore } from '../../stores/tasks';
import AgendaTask from './AgendaTask.vue';
import type { Task } from '../../types';
import { Times } from '../../utils/constants'
import AgendaTimeslot from './AgendaTimeslot.vue';

dayjs.extend(advancedFormat);

const props = defineProps<{
  date: dayjs.Dayjs
}>()

const store = useTasksStore();

const tasks = computed(() => {

  if(!store.tasks || Object.keys(store.tasks).length === 0) {
    return [];
  }

  const tasksByDate = store.tasks[props.date.format('YYYY-MM-DD')];

  if(!tasksByDate) {
    return [];
  }

  return tasksByDate
})

const hours = computed(() => [...Array.from({ length: Times.MORNING_END - 7 }, (v, k) => 7 + k), ...Array.from({ length: 23 - Times.EVENING_START }, (v, k) => Times.EVENING_START + k)])

</script>

<template>
  <div class="day">
    <div class="title">
      <!-- <div>{{ date.format('dddd') }}, {{ date.format('MMM Do') }}</div> -->
      <div>{{ date.format('dddd') }}</div>
    </div>

    <div v-if="date.day() === 6 || date.day() === 0" class="periods">
      <!-- <div class="period morning">
        <h4>Morning</h4>
        <div class="tasks">
          <AgendaTask v-for="(task, index) in tasks.morning" :key="index" :task="task" />
        </div>
      </div>
      <div class="period afternoon">
        <h4>Afternoon</h4>
        <div class="tasks">
          <AgendaTask v-for="(task, index) in tasks.afternoon" :key="index" :task="task" />
        </div>
      </div>
      <div class="period evening">
        <h4>Evening</h4>
        <div class="tasks">
          <AgendaTask v-for="(task, index) in tasks.evening" :key="index" :task="task" />
        </div>
      </div> -->
    </div>
    <div v-else class="periods">
      <div class="period morning">
        <div class="timeslots">
          <AgendaTimeslot
            v-for="number in Array.from({ length: Times.MORNING_END - 7 }, (v, k) => 7 + k)"
            :tasks="tasks"
            :time="number"
            :date="date"
            :key="number"
            :showTime="date.day() === 1" />
        </div>
      </div>
      <div class="period afternoon">
      </div>
      <div class="period evening">
        <div class="timeslots">
          <AgendaTimeslot
            v-for="number in Array.from({ length: 23 - Times.EVENING_START }, (v, k) => Times.EVENING_START + k)"
            :tasks="tasks"
            :time="number"
            :date="date"
            :key="number"
            :showTime="date.day() === 1" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.day {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
}

.title {
  font-size: 24px;
  margin: 0 auto;
}

.periods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  height: 100%;
  flex: 1;
  border-radius: 16px;
  .period.afternoon {
    height: 5%;
    background-color: var(--md-sys-color-surface);
  }

  .period.evening {
    height: 70%;
  }
}

.period {
    height: 30%;
    border-radius: 16px;
    display: flex;
    flex-direction: column;

    h4 {
      font-size: 12px;
      border-radius: 12px 12px 0 0;
      padding: 0 1rem;
    }
  }

.tasks {
  padding: 0.5rem;
}

.timeslots {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
