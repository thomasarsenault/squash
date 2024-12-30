<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useFitnessStore } from '@/stores/fitness';
import dayjs from 'dayjs';
import InputDialog from '@/components/InputDialog.vue';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const store = useFitnessStore();

const workout = computed(() => store.editModal.workout);
const editMode = computed(() => store.editModal.open)

const date = ref();
const type = ref();
const start = ref()
const end = ref();
const notes = ref();

const setDefaults = () => {
    date.value = dayjs().format('MM/DD/YYYY');
    type.value = '';
    start.value = new Date();
    end.value = null;
    notes.value = null;
}

const getWorkoutObj = () => {
    return {
        date: date.value,
        type: type.value.value,
        start: dayjs(start.value).format('HH:mm:ss'),
        end: end.value ? dayjs(end.value).format('HH:mm:ss') : null,
        notes: notes.value
    }
}

const addWorkout = () => {
    const workout = getWorkoutObj();

    store.addWorkout(workout);
    store.modalOpen = false;
    setDefaults();
}

const editWorkout = () => {
    const workout = getWorkoutObj();
    (workout as any).id = store.editModal.workout.id;

    store.updateWorkout(workout);
    store.modalOpen = false;
    store.editModal.open = false;

    setDefaults();
}

const deleteWorkout = () => {
    store.deleteWorkout(store.editModal.workout);
    store.modalOpen = false;
    store.editModal.open = false;

    setDefaults();
}

watch(workout, (value) => {
    if(store.editModal.open) {
        const typeObject = store.dropdownTypes.find(t => t.value === value.type)

        date.value = value.date;
        type.value = typeObject;
        start.value = dayjs(value.start, 'HH:mm:ss').toDate();
        end.value = value.end ? dayjs(value.end, 'HH:mm:ss').toDate() : null;
        notes.value = value.notes
    } else {
        setDefaults();
    }

})

</script>

<template>
    <div class="add-workout">
        <InputDialog v-model:visible="store.modalOpen" :header="`💪 ${store.editModal.open ? 'Edit' : 'Add'} Workout`">
            <div class="fields">
                <FloatLabel>
                    <Calendar id="date" v-model="date" />
                    <label for="date">Date</label>
                </FloatLabel>
                <FloatLabel>
                    <Select id="category"
                        v-model="type" 
                        :options="store.dropdownTypes"
                        placeholder="Type"
                        scrollHeight="400px">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="workout-option">
                                <div class='workout-circle' :style="{ backgroundColor: slotProps.value.color }"></div>
                                <div>{{ slotProps.value.label }}</div>
                            </div>
                            <div v-else class="workout-option">
                                <div class='workout-circle' :style="{ backgroundColor: 'lightgrey' }"></div>
                                <div>Choose workout</div>
                            </div>
                        </template>
                        <template #option="slotProps">
                            <div class="workout-option">
                                <div class='workout-circle' :style="{ backgroundColor: slotProps.option.color }"></div>
                                <div>{{ slotProps.option.label }}</div>
                            </div>
                        </template>
                    </Select>
                    <label for="category">Type</label>
                </FloatLabel>
                <FloatLabel>
                    <DatePicker id="start" v-model="start" timeOnly fluid />
                    <label for="start">Start time</label>
                </FloatLabel>
                <FloatLabel>
                    <DatePicker id="end" v-model="end" timeOnly />
                    <label for="end">End time</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="notes" v-model="notes"/>
                    <label for="notes">Notes</label>
                </FloatLabel>
            </div>
            <template #footer>
                <div class="footer">
                    <template v-if="editMode">
                        <Button label="Delete" severity="secondary" @click="deleteWorkout" />
                        <Button label="Edit" @click="editWorkout" />
                    </template>
                    <template v-else>
                        <template v-if="end">
                            <Button label="Add" @click="addWorkout" />
                        </template>
                        <template v-else>
                            <Button label="Start" @click="addWorkout" />
                        </template>
                    </template>
                </div>
            </template>
        </InputDialog>
    </div>
</template>

<style scoped lang="scss">
.fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 1.5rem;

    span input {
        width: 100%;
    }
    input {
        width: 100%;
    }

    :deep(.p-inputwrapper) {
        width: 100%;
    }
}

.workout-option {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}
.workout-circle {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
}

.footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
}


</style>