<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useFitnessStore } from '@/stores/fitness';
import dayjs from 'dayjs';
import InputDialog from '@/components/InputDialog.vue';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import WorkoutDot from './WorkoutDot.vue';
import type { Workout, WorkoutInput } from '@/types/Fitness';

dayjs.extend(customParseFormat);

const store = useFitnessStore();

const workout = computed(() => store.editModal.workout);
const editMode = computed(() => store.editModal.open);

const date = ref<any>('');
const type = ref<{ label: string; value: string }>();
const notes = ref();

const setDefaults = () => {
  date.value = (store.dayModal.date ? store.dayModal.date : dayjs()).format('MM/DD/YYYY');
  type.value = { label: 'Choose workout', value: '' };
  notes.value = undefined;
};

const getWorkoutObj = (): WorkoutInput => {
  return {
    date: date.value,
    type: type.value?.value,
    notes: notes.value,
  };
};

const addWorkout = () => {
  const workout = getWorkoutObj();

  store.addWorkout(workout);
  store.modalOpen = false;
  setDefaults();
};

const editWorkout = () => {
  const workout = getWorkoutObj() as Workout;
  if (!store.editModal.workout.id) {
    return;
  }

  workout.id = store.editModal.workout.id;

  store.updateWorkout(workout);
  store.modalOpen = false;
  store.editModal.open = false;

  setDefaults();
};

const deleteWorkout = () => {
  store.deleteWorkout(store.editModal.workout);
  store.modalOpen = false;
  store.editModal.open = false;

  setDefaults();
};

watch(workout, (value) => {
  if (store.editModal.open) {
    const typeObject = store.dropdownTypes.find((t) => t.value === value.type);

    date.value = value.date;
    type.value = typeObject;
    notes.value = value.notes;
  } else {
    setDefaults();
  }
});
</script>

<template>
  <div class="add-workout">
    <InputDialog
      v-model:visible="store.modalOpen"
      :header="`${store.editModal.open ? 'Edit' : 'Add'} Workout`"
      :icon="store.editModal.open ? 'pencil' : 'plus'">
      <div class="fields">
        <div class="full">
          <FloatLabel variant="in">
            <Calendar id="date" v-model="date" />
            <label for="date">Date</label>
          </FloatLabel>
        </div>
        <div class="full">
          <FloatLabel variant="in">
            <Select
              id="category"
              v-model="type"
              :options="store.dropdownTypes"
              placeholder="Type"
              scrollHeight="400px">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="workout-option">
                  <WorkoutDot :type="slotProps.value.label" size="small" />
                  <div>{{ slotProps.value.label }}</div>
                </div>
              </template>
              <template #option="slotProps">
                <div class="workout-option">
                  <WorkoutDot :type="slotProps.option.label" size="small" />
                  <div>{{ slotProps.option.label }}</div>
                </div>
              </template>
            </Select>
            <label for="category">Type</label>
          </FloatLabel>
        </div>
        <div class="full">
          <FloatLabel variant="in">
            <InputText id="notes" v-model="notes" />
            <label for="notes">Notes</label>
          </FloatLabel>
        </div>
      </div>
      <template #footer>
        <div class="footer">
          <template v-if="editMode">
            <Button label="Delete" severity="secondary" @click="deleteWorkout" />
            <Button label="Edit" @click="editWorkout" />
          </template>
          <template v-else>
            <Button label="Add" @click="addWorkout" />
          </template>
        </div>
      </template>
    </InputDialog>
  </div>
</template>

<style scoped lang="scss">
.fields {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;

  label {
    font-weight: normal;
  }
  span input {
    width: 100%;
  }
  input {
    width: 100%;
  }

  :deep(.p-inputwrapper) {
    width: 100%;
  }

  .full {
    grid-column: 1 / -1;
  }
}

.workout-option {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}
</style>
