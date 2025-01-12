<script setup lang="ts">
import type { Workout } from '@/types/Fitness';
import { computed, defineProps } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import WorkoutDot from './WorkoutDot.vue';

interface CalendarDay {
    date: Dayjs;
    isCurrentMonth: boolean;
    workouts: Workout[];
}

// TODO: show the last x weeks instead of current month

const props = defineProps<{
    workouts: Workout[];
    year?: number;
    month?: number;
}>();

// default to current year & month, might use these props later for switching months
const year = props.year ?? dayjs().year();
const month = props.month ?? dayjs().month();


const workoutsMap = computed((): Map<string, Workout[]> => {
    const map = new Map();

    props.workouts.forEach((workout) => {
        if (!map.has(workout.date)) {
            map.set(workout.date, []);
        }
        map.get(workout.date)?.push(workout);
    });

    return map;
})

const weeks = computed(() => {
    const weeksArray: CalendarDay[][] = [];
    const firstOfMonth = dayjs().year(year).month(month).date(1);
    
    let dayOfWeek = firstOfMonth.day();
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    const startDate = firstOfMonth.date(firstOfMonth.date() - (dayOfWeek - 1)).subtract(3, 'weeks')

    // 6 rows (weeks), 7 columns (days)
    const totalDays = 42;
    const days: CalendarDay[] = [];

    for (let i = 0; i < totalDays; i++) {
        const currentDate = startDate.date(startDate.date() + i);
        const dateStr = currentDate.format('YYYY-MM-DD');

        days.push({
            date: currentDate,
            isCurrentMonth: currentDate.month() === month,
            workouts: workoutsMap.value.get(dateStr) ?? [],
        });
    }

    // Split the days array into weeks (arrays of 7 days each).
    for (let i = 0; i < totalDays; i += 7) {
        weeksArray.push(days.slice(i, i + 7));
    }

    return weeksArray;
});
</script>

<template>
    <Card>
        <template #content>
            <div class="calendar">
                <div class="header">
                    <div class="day-cell" v-for="day in ['Monday', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
                        {{ day }}
                    </div>
                </div>
                <div class="grid">
                    <div class="week" v-for="(week, weekIndex) in weeks" :key="weekIndex">
                        <div class="day-cell" v-for="(day, dayIndex) in week" :key="dayIndex" :class="{ 'current-month': day.isCurrentMonth }">
                            <div class="date-number">{{ day.date.date() }}</div>
                            <div class="event-labels" v-if="day.workouts.length">
                                <div class="workout" v-for="(workout, labelIndex) in day.workouts" :key="labelIndex">
                                    <WorkoutDot :type="workout.type" />
                                    <div class="type">
                                        {{ workout.type }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>

</template>

<style lang="scss" scoped>
.calendar {
    display: flex;
    flex-direction: column;
}

.header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: 800;
    padding: 0.5rem 0;
}

.grid {
    display: grid;
    grid-auto-rows: minmax(80px, auto);
    grid-gap: 1px;
    padding: 1px;
    background-color: rgb(236, 236, 236);
    border-radius: 8px;

    .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-gap: 1px;
        
        .day-cell {
            padding: 0.5rem;
            box-sizing: border-box;

            &.current-month {
                background-color: #ffffff;
            }

            &:not(.current-month) {
                background-color: #fbfbfb;
            }

            .date-number {
                font-size: 0.8rem;
                color: #878787;
            }
        }
    }
}

.workout {
    display: flex;
    margin-top: 0.5rem;
    gap: 0.5rem;

    .type {
	    @include breakpoint('mobile') {
            display: none;
        }
    }
}
</style>
