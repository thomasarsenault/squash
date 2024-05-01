<script setup lang="ts">
import Task from '../Task.vue';
import { ref, computed } from 'vue';
import type { Task as TaskType } from '../../types';
import { useTasksStore } from '../../stores/tasks';
import { getDateByZone } from '../../utils/date';
import { AgendaZones } from '../../utils/constants';

const props = defineProps<{
  tasks: TaskType[],
  hovered: boolean,
  zone: AgendaZones
}>()

const store = useTasksStore();
const emit = defineEmits(['dragEnd', 'drag']);
const newTaskText = ref('');
const newTaskPromptOpen = ref(false);

const date = computed(() => getDateByZone(props.zone));

const addTask = async () => {
  const data = await store.addTask({
    name: newTaskText.value,
    date: date.value,
  });
  newTaskText.value = '';
}


</script>

<template>
    <div class="agenda-container">
        <div class="header">
            <div class="title">{{ zone }}</div>
            <md-filled-tonal-button @click="newTaskPromptOpen = !newTaskPromptOpen">
                    {{ newTaskPromptOpen ? 'Close' : 'New Task' }}
            </md-filled-tonal-button>
        </div>
        <div :class="`new-task ${newTaskPromptOpen ? 'open' : ''}`">
            <md-filled-text-field
                autofocus
                label="New Task"
                class="new-task-input"
                :value="newTaskText"
                @input="newTaskText = $event.target.value"
                @keydown.enter="() => addTask()"
            />
            <div class="options">
                <md-filled-button>
                Add
                </md-filled-button>
            </div>
        </div>
        <div :class="`drag-zone ${hovered ? 'hovered' : ''}`" :id="zone">
            <div class="tasks">
                <Task v-for="(task, index) in tasks" :key="index" :task="task"
                    @dragEnd="emit('dragEnd')"
                    @drag="e => emit('drag', e)"/>
                <!-- <div class="placement-indicator-wrapper">
                  <div id="placement-indicator" class="placement-indicator" />
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped>

/* .placement-indicator-wrapper {
  height: 1rem;
  width: 100%;
  position: relative;

  .placement-indicator {
    position: absolute;
    width: 100%;
    height: 1rem;
    top: 0;
    background-color: red;
  }
} */



.agenda-container {
  flex: 1;
  background-color: var(--md-sys-color-surface);
  padding: 1rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    .title {
      font-size: 24px;
    }
  }

  .new-task {
    width: 100%;
    margin-bottom: 1rem;
    display: none;

    &.open {
      display: block;
    }
    .new-task-input {
      width: 100%;
    }

    .options {
      display: none;
      border-radius: 16px;
      margin: 1rem 0;
      padding: 1rem;
      background-color: var(--md-sys-color-surface-variant);
    }
  }
}

.drag-zone {
  border-radius: 16px;
  flex: 1;
  min-height: 2rem;

  &.hovered {
    background-color: var(--md-sys-color-surface-variant);
  }
}

.tasks {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;
}

</style>
