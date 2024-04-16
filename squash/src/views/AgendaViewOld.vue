<script setup lang="ts">
//make call to get all tasks, load into pinia store
import AgendaDay from '../components/AgendaOld/AgendaDay.vue';
import dayjs from 'dayjs';
import { useTasksStore } from '../stores/tasks';
import { onMounted } from 'vue';
import AgendaBacklog from '../components/AgendaOld/AgendaBacklog.vue';
import AgendaGrid from '../components/AgendaOld/AgendaGrid.vue';
const store = useTasksStore();

onMounted(async () => {
  store.getTasks();
})

</script>

<template>
  <main>
    <div class="agenda">
      <AgendaBacklog />
      <div class="calendar">
        <AgendaGrid />
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

.calendar {
  border-radius: 16px;
  flex: 1;
  width: 100%;
  display: flex;
  gap: 1rem;
  background-color: var(--md-sys-color-surface-container-lowest);
  // background-color: var(--md-sys-color-surface)
  overflow: hidden;
}

.days {
  border-radius: 16px;
  flex: 1;
  width: 100%;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  padding-left: 4rem;
  background-color: var(--md-sys-color-surface)
}
</style>