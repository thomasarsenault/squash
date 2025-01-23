<script setup lang="ts">
import type { Workout } from '@/types/Fitness';
import { computed, defineProps, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import WorkoutDot from './WorkoutDot.vue';
import InputDialog from '../InputDialog.vue';
import WorkoutCard from './WorkoutCard.vue';
import { useFitnessStore } from '@/stores/fitness';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const store = useFitnessStore();

interface CalendarDay {
    date: Dayjs;
    isCurrentMonth: boolean;
    workouts: Workout[];
}

// TODO: show the last x weeks instead of current month

const props = defineProps<{
    workouts: Workout[];
    readOnly?: boolean;
    year?: number;
    month?: number;
}>();

// default to current year & month, might use these props later for switching months
const year = props.year ?? dayjs().year();
const month = props.month ?? dayjs().month();

const dayModalOpen = ref(false);
const selectedDay = ref<CalendarDay | undefined>();

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

    const today = dayjs().subtract(2, 'day');

    const startOfCurrentWeek = today.startOf('isoWeek');

    const startDate = startOfCurrentWeek.subtract(5, 'weeks');

    // 6 rows (weeks), 7 columns (days)
    const totalDays = 42;
    const days: CalendarDay[] = [];

    for (let i = 0; i < totalDays; i++) {
        const currentDate = startDate.add(i, 'day');
        const dateStr = currentDate.format('YYYY-MM-DD');

        days.push({
            date: currentDate,
            isCurrentMonth: currentDate.month() === today.month(),
            workouts: workoutsMap.value.get(dateStr) ?? [],
        });
    }

    for (let i = 0; i < totalDays; i += 7) {
        weeksArray.push(days.slice(i, i + 7));
    }

    return weeksArray;
});

const openDayModal = (day: CalendarDay) => {
    if(!props.readOnly) {
        dayModalOpen.value = true;
        selectedDay.value = day;
    }
}

const closeDayModal = () => {
    dayModalOpen.value = false;
    selectedDay.value = undefined;
}

const openEditModal = (workout: any) => {
    store.editModal.workout = workout;
    store.editModal.open = true;
    store.modalOpen = true;
    closeDayModal();
}

// TODO: this should auto set the date to whatever was in selectedDay.date
const openAddModal = () => {
	store.modalOpen = true;
	store.editModal.open = false;
	store.editModal.workout = {} as Workout;
    closeDayModal();
}

</script>

<template>
    <Card>
        <template #content>
            <div class="calendar">
                <div class="header">
                    <div class="day-cell" v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
                        {{ day }}
                    </div>
                </div>
                <div class="grid">
                    <div class="week" v-for="(week, weekIndex) in weeks" :key="weekIndex">
                        <div class="day-cell" v-for="(day, dayIndex) in week" :key="dayIndex"
                            @click="() => openDayModal(day)"
                            :class="{ 'current-month': day.isCurrentMonth }">
                            <div class="date-number">{{ day.date.date() }}</div>
                            <div class="workouts" v-if="day.workouts.length">
                                <div class="workout" v-for="(workout, labelIndex) in day.workouts" :key="labelIndex">
                                    <WorkoutDot :type="workout.type" size="small-on-mobile"/>
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
    <InputDialog v-model:visible="dayModalOpen" :header="selectedDay?.date.format('YYYY-MM-DD')">
        <div class="workout-dialog">
            <WorkoutCard v-for="workout in selectedDay?.workouts" :key="workout.id"
                :workout="workout" 
                @click="() => openEditModal(workout)" />
        </div>
        <template #footer>
                <div class="footer">
                    <Button label="Add New" @click="openAddModal" />
                    <Button label="Close" severity="secondary" @click="closeDayModal" />
                </div>
            </template>
    </InputDialog>
</template>

<style lang="scss" scoped>
// TODO: tweak grays and use vars
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

    @include breakpoint('mobile') {
        grid-auto-rows: minmax(50px, auto);
    }

    .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-gap: 1px;
        
        .day-cell {
            padding: 0.5rem;
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
            width: 100%;
            gap: 0.5rem;
            cursor: pointer;

            @include breakpoint('mobile') {
                flex-direction: column;
            }

            &.current-month {
                background-color: #ffffff;
            }

            &:not(.current-month) {
                background-color: #fcfcfc;
            }

            .date-number {
                font-size: 0.8rem;
                color: #878787;
                justify-self: flex-end;

                @include breakpoint('mobile') {
                    display: flex;
                }
            }
        }
    }
}

.workouts {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    @include breakpoint('mobile') {
        flex-direction: row;
    }

    .workout {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #878787;

        .type {
            @include breakpoint('mobile') {
                display: none;
            }
        }
    }
}

// dialog when you open a day
.workout-dialog {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}


.footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

</style>
