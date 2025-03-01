<script setup lang="ts">
import Task from '../Agenda/Task.vue';
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

const zoneToLabel = {
  [AgendaZones.TODAY]: 'Today',
  [AgendaZones.TOMORROW]: 'Tomorrow',
  [AgendaZones.THIS_WEEK]: 'Backlog',
}
</script>

<template>
  <Card class="agenda-container">
    <template #content>
        <div class="header">
              <div class="title">{{ zoneToLabel[zone] }}</div>
              <Button severity="secondary" @click="newTaskPromptOpen = !newTaskPromptOpen">{{ newTaskPromptOpen ? 'Close' : 'New Task' }}</Button>
          </div>
          <div :class="`new-task ${newTaskPromptOpen ? 'open' : ''}`">
              <!-- primevue text field -->
              <InputText autofocus v-model="newTaskText" class="new-task-input" placeholder="New Task" @keydown.enter="addTask"/>
          </div>
          <div :class="`drag-zone ${hovered ? 'hovered' : ''}`" :id="zone">
              <div class="tasks">
                  <Task v-for="(task, index) in tasks" :key="task.id" :task="task"
                      @dragEnd="emit('dragEnd')"
                      @drag="e => emit('drag', e)"/>
                  <!-- <div class="placement-indicator-wrapper">
                    <div id="placement-indicator" class="placement-indicator" />
                  </div> -->
              </div>
          </div>
    </template>
  </Card>
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
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    .title {
      font-size: 1.2rem;
      font-weight: bold;
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
  }
}

.drag-zone {
  border-radius: var(--p-border-radius-lg);
  flex: 1;
  min-height: 10rem;

  &.hovered {
    background-color: var(--p-surface-100);
  }
}

.tasks {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;
}

</style>
