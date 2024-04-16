<script setup lang="ts">
import dayjs from 'dayjs'
import { computed } from 'vue';
import { useTasksStore } from '../../stores/tasks';
import { Times } from '../../utils/constants'
import advancedFormat from 'dayjs/plugin/advancedFormat';;
import AgendaTimeslot from './AgendaTimeslot.vue';
import AgendaTask from '../AgendaTask.vue';

dayjs.extend(advancedFormat);

// const props = defineProps<{
//   date: dayjs.Dayjs
// }>()

const store = useTasksStore();

// const tasks = computed(() => {

//     if(!store.tasks || Object.keys(store.tasks).length === 0) {
//         return [];
//     }

//     const tasksByDate = store.tasks[props.date.format('YYYY-MM-DD')];

//     if(!tasksByDate) {
//         return [];
//     }

//     return tasksByDate;
// });

const getDaysOfCurrentWeek = computed(() => Array.from({ length: 7 }, (_, i) => dayjs().startOf('week').add(i + 1, 'day')));

</script>

<template>
    <div class="grid">
        <div class="day" v-for="date in getDaysOfCurrentWeek" :key="date.format('YYYY-MM-DD')">
            <div :class="{header: true, current: dayjs().day() === date.day()}">
                <div>{{ date.format('dddd') }}</div>
                <div class="date">{{ date.format('MMM Do') }}</div>
            </div>
            <AgendaTimeslot
                v-for="number in Array.from({ length: Times.EVENING_END - Times.MORNING_START }, (v, k) => 7 + k)"
                :tasks="store.tasks[date.format('YYYY-MM-DD')] || []"
                :time="number"
                :date="date"
                :key="number" />
            <!-- <AgendaTimeslot
                v-for="number in Array.from({ length: Times.MORNING_END - 7 }, (v, k) => 7 + k)"
                :tasks="store.tasks[date.format('YYYY-MM-DD')] || []"
                :time="number"
                :date="date"
                :key="number" />
            <AgendaTimeslot
                v-for="number in Array.from({ length: 23 - Times.EVENING_START }, (v, k) => Times.EVENING_START + k)"
                :tasks="store.tasks[date.format('YYYY-MM-DD')] || []"
                :time="number"
                :date="date"
                :key="number" /> -->
        </div>
    </div>
</template>

<style scoped lang="scss">
.grid {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: 16px;
}

.day {
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 100%;
    border-left: 1px solid lightgray;
}

.header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid lightgray;
    background-color: var(--md-sys-color-surface);
    background-color: var(--md-sys-color-secondary);
    color: var(--md-sys-color-on-primary);
    font-size: 24px;

    .date {
        font-size: 12px;
    }

    &.current {
        background-color: var(--md-sys-color-tertiary);
    }
}
</style>
