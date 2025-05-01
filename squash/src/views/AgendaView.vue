<script setup lang="ts">
import dayjs from 'dayjs';
import { useTasksStore } from '../stores/tasks.legacy';
import { onMounted, ref, computed } from 'vue';
import AgendaContainer from '../components/Agenda/AgendaContainer.vue';
import { AgendaZones } from '../utils/constants'
import { getDateByZone } from '../utils/date';
import EditTask from '../components/Agenda/EditTask.vue';

const store = useTasksStore();

onMounted(async () => {
  store.getTasks().then(() => {
    console.log('tasks', store.tasks);
  })
})

const hoveredZone = ref<AgendaZones | null>(null);
const aboveTask = ref<Element | null>(null);
// TODO: refactor for no constant document query, cleaner code
// TODO: even more refactoring, i just made it way uglier
const drag = e => {
  const zones = document.querySelectorAll('.drag-zone');
  let outside = true;
  aboveTask.value = null;
  zones.forEach((zone) => {
    const rect = zone.getBoundingClientRect();
    if (e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom) {
      hoveredZone.value = zone.id as AgendaZones;

      const tasks = zone.querySelectorAll('.task');

      for(const task of tasks) {
        if(task.getAttribute('data-id') === String(store.currentDraggedTask.id)) {
          continue;
        }
        
        task.classList.remove('enable-placement-indicator');

        // if mouse above the task
        if(!(e.clientY >= task.getBoundingClientRect().top + task.getBoundingClientRect().height / 2)) {
          if(!aboveTask.value) {
            aboveTask.value = task;
          }
        }
      };

      if(aboveTask.value) {
        aboveTask.value.classList.add('enable-placement-indicator');
      }

      outside = false;
    }
  });
  
  if(outside) {
    const tasks = document.querySelectorAll('.drag-zone .task');
    for(const task of tasks) {
      task.classList.remove('enable-placement-indicator');
    }
    hoveredZone.value = null;
  }
}

const removePlacementIndicator = () => {
  hoveredZone.value = null;

  const tasks = document.querySelectorAll('.drag-zone .task');
  for(const task of tasks) {
    task.classList.remove('enable-placement-indicator');
  }
}
const dragEnd = async () => {
  if(!hoveredZone.value) {
    removePlacementIndicator();
    return;
  }

  const taskRanksDeepCopy = JSON.parse(JSON.stringify(store.taskRanks))
  if(!taskRanksDeepCopy[getDateByZone(hoveredZone.value)]) {
    taskRanksDeepCopy[getDateByZone(hoveredZone.value)] = []
  }

  const currentTaskIndex = taskRanksDeepCopy[getDateByZone(hoveredZone.value)].findIndex(taskId => taskId === store.currentDraggedTask.id)

  //remove current task if its in the ranks
  if(currentTaskIndex !== -1) {
    taskRanksDeepCopy[getDateByZone(hoveredZone.value)].splice(currentTaskIndex, 1)
  } else {
    const currentTaskRanks = taskRanksDeepCopy[dayjs(store.currentDraggedTask.date).format('YYYY-MM-DD')]
    currentTaskRanks.splice(currentTaskRanks.findIndex(taskId => taskId === store.currentDraggedTask.id), 1)
  }

  const aboveTaskIndex = taskRanksDeepCopy[getDateByZone(hoveredZone.value)].findIndex(taskId => taskId === Number(aboveTask.value?.getAttribute('data-id')))

  if(aboveTaskIndex === -1) {
    taskRanksDeepCopy[getDateByZone(hoveredZone.value)].push(store.currentDraggedTask.id)
  } else {
    taskRanksDeepCopy[getDateByZone(hoveredZone.value)].splice(aboveTaskIndex, 0, store.currentDraggedTask.id)
  }

  store.updateTaskRanks(taskRanksDeepCopy[getDateByZone(hoveredZone.value)], getDateByZone(hoveredZone.value))
  if(store.currentDraggedTask.date !== getDateByZone(hoveredZone.value)) {
    store.updateTaskRanks(taskRanksDeepCopy[dayjs(store.currentDraggedTask.date).format('YYYY-MM-DD')], dayjs(store.currentDraggedTask.date).format('YYYY-MM-DD'));
  }

  await store.updateTask({
    id: store.currentDraggedTask.id,
    date: getDateByZone(hoveredZone.value),
  });

  removePlacementIndicator();
}

// TODO: rankRanks updates instantly, but tasks being updated is a network call
const today = computed(() => {
  const tasks = store.tasks[dayjs().format('YYYY-MM-DD')];

  if(!tasks) {
    return [];
  }

  return (store.taskRanks[dayjs().format('YYYY-MM-DD')] || []).map(taskId => tasks.find(task => task.id === taskId) || {})
  // .sort((a, b) => a.rank - b.rank)
})

const tomorrow = computed(() => {
  const tasks = store.tasks[dayjs().add(1, 'day').format('YYYY-MM-DD')]

  if(!tasks) {
    return [];
  }
  
  return (store.taskRanks[dayjs().add(1, 'day').format('YYYY-MM-DD')] || []).map(taskId => tasks.find(task => task.id === taskId) || {})
})

const week = computed(() => {
  const tasks = store.tasks[dayjs().add(7, 'day').format('YYYY-MM-DD')]

  if(!tasks) {
    return [];
  }

  return (store.taskRanks[dayjs().add(7, 'day').format('YYYY-MM-DD')] || []).map(taskId => tasks.find(task => task.id === taskId) || {})
})

</script>

<template>
  <main>
    <div class="agenda">
      <div class="current-tasks">
        <AgendaContainer :tasks="today" :zone="AgendaZones.TODAY" :hovered="hoveredZone === AgendaZones.TODAY" @dragEnd="dragEnd" @drag="drag"/>
        <AgendaContainer :tasks="tomorrow" :zone="AgendaZones.TOMORROW" :hovered="hoveredZone === AgendaZones.TOMORROW" @dragEnd="dragEnd" @drag="drag"/>
        <AgendaContainer :tasks="week" :zone="AgendaZones.THIS_WEEK" :hovered="hoveredZone === AgendaZones.THIS_WEEK" @dragEnd="dragEnd" @drag="drag"/>
      </div>
    </div>
    <EditTask id="edit-task-dialog"/>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
}

.agenda {
  display: flex;
  height: 100%;
  width: 100%;
  gap: 1rem;
}

.current-tasks {
  display: flex;
  flex: 1;
  gap: 2rem;

  @include breakpoint('mobile') {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>