<script setup lang="ts">
import dayjs from 'dayjs';
import { useTasksStore } from '../stores/tasks';
import { onMounted, ref, computed } from 'vue';
import AgendaContainer from '../components/Agenda/AgendaContainer.vue';
import { AgendaZones } from '../utils/constants'
import { getDateByZone } from '../utils/date';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/textfield/filled-text-field.js';

const store = useTasksStore();

onMounted(async () => {
  store.getTasks().then(() => {
    console.log('tasks', store.tasks);
  })
})

const hoveredZone = ref<AgendaZones | null>(null);

// TODO: refactor for no constant document query, cleaner code
const drag = e => {
  const zones = document.querySelectorAll('.drag-zone');
  let outside = true;
  zones.forEach((zone) => {
    if (e.clientX >= zone.getBoundingClientRect().left &&
        e.clientX <= zone.getBoundingClientRect().right &&
        e.clientY >= zone.getBoundingClientRect().top &&
        e.clientY <= zone.getBoundingClientRect().bottom) {
      hoveredZone.value = zone.id as AgendaZones;
      outside = false;
    }
  });
  
  if(outside) {
    hoveredZone.value = null;
  }
}

const dragEnd = () => {
  if(hoveredZone.value) {
    store.updateTask({
      id: store.currentDraggedTask.id,
      start: getDateByZone(hoveredZone.value),
      end: null,
    });
  
  }
  hoveredZone.value = null;
}

const today = computed(() => {
  return store.tasks[dayjs().format('YYYY-MM-DD')]
  // return store.tasks?.filter(task => dayjs(task.start).isSame(dayjs(), 'day'));
})

const tomorrow = computed(() => {
  return store.tasks[dayjs().add(1, 'day').format('YYYY-MM-DD')]

  // return store.tasks?.filter(task => dayjs(task.start).isSame(dayjs().add(1, 'day'), 'day'));
})

const week = computed(() => {
  return store.tasks[dayjs().add(7, 'day').format('YYYY-MM-DD')]
  // return store.tasks?.filter(task => dayjs(task.start).isAfter(dayjs().add(1, 'day'), 'day'));
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
  gap: 1rem;
}
</style>