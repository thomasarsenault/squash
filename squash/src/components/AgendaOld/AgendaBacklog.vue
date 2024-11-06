<script setup lang="ts">
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat';;
import { computed, toRaw } from 'vue';
import { useTasksStore } from '../../stores/tasks';
import AgendaTask from './AgendaTask.vue';
import type { Task } from '../../types';
import { Times } from '../../utils/constants'
import AgendaTimeslot from './AgendaTimeslot.vue';
import Draggable from 'vuedraggable';

dayjs.extend(advancedFormat);

const store = useTasksStore();

// const tasks = computed(() => {

//   if(!store.tasks || Object.keys(store.tasks).length === 0) {
//     return [];
//   }

//   if(!store.tasks.backlog) {
//     return [];
//   }

//   return store.tasks['backlog'];
// })

const draggableItems = computed({
  get: () => {
    return store.tasks['backlog']},
  set: () => {}
});

const updateTask = (e) => {
    console.log('update task', e)
}

</script>

<template>
<div class="backlog">
    <div class="title">Backlog</div>
    <div class="tasks">
        <Draggable
            v-model="draggableItems"
            group="tasks"
            @change="(e) => updateTask(e)"
            class="drag-zone"
            item-key="id">
            <template #item="{element}">
                <AgendaTask :task="element" />
            </template>
        </Draggable>
    </div>
</div>
</template>

<style scoped lang="scss">
.backlog {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  width: 20%;
  background-color: var(--md-sys-color-surface);
  padding: 1rem;
}

.title {
    font-size: 24px;
}

.tasks {
    height: 100%;
    border-radius: 12px;
}

.drag-zone {
    height: 100%;
    border-radius: 16px;
}
</style>
