<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { onMounted, ref, computed } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import Task from '@/components/Agenda/Task.vue';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const store = useTasksStore();

onMounted(async () => {
  store.getTasks().then(() => {
    console.log('tasks', store.taskRanks);
  })
})

const today = computed(() => {
  const tasks = store.tasks[dayjs().format('YYYY-MM-DD')];

  if(!tasks) {
    return [];
  }

  return (store.taskRanks[dayjs().format('YYYY-MM-DD')] || []).map(taskId => tasks.find(task => task.id === taskId) || {})
  // .sort((a, b) => a.rank - b.rank)
})


</script>

<template>
    <Card>
        <template #title>
            📝 Today's Items
        </template>
        <template #content>
          <div class="task-list">
            <Task v-for="task in today" :task="task" disableEditing/>
          </div>
        </template>
    </Card>
</template>

<style lang="scss" scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>