<script setup lang="ts">
import dayjs from 'dayjs'
import { useTasksStore } from '@/stores/tasks';
import type { Task } from '@/types';
import { computed, ref } from 'vue';
import EditTask from './EditTask.vue';

import Card from 'primevue/card';

const props = defineProps<{
  task: Task,
  disableEditing?: boolean
}>()

const store = useTasksStore();

const emit = defineEmits(['drag', 'dragEnd']);

const draggable = ref(null);
const isDragging = ref(false);
const x = ref(0);
const y = ref(0);
const offsetX = ref(0);
const offsetY = ref(0);

const onClick = (e) => {
    if(e.target.classList.contains('p-checkbox-input')) return;
    if(e.button === 0 && !props.disableEditing) {
        store.editModal.isOpen = true;
        store.editModal.task = props.task;
        return;
    }

    e.preventDefault();
    startDrag(e);
}

const toggleTaskComplete = () => {
    store.updateTask({id: props.task.id, completed: !props.task.completed});
}

const startDrag = (e) => {
    if(props.disableEditing) return;
    isDragging.value = true;
    x.value = e.clientX;
    y.value = e.clientY;
    offsetX.value = e.clientX - x.value;
    offsetY.value = e.clientY - y.value;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    store.updateCurrentDraggedTask(props.task);
    drag(e);
}

const drag = (e) => {
    // if (!isDragging.value) return;
    // x.value = e.clientX - offsetX.value;
    // y.value = e.clientY - offsetY.value;
    emit('drag', e)
    x.value = e.clientX;
    y.value = e.clientY;
}

const endDrag = (e) => {
    console.log('end drag', e)
    e.preventDefault();
    isDragging.value = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
    emit('dragEnd')
}
const isCompleted = computed(() => props.task.completed);
</script>

<template>
    <div :class="`placeholder ${isDragging ? 'dragging' : ''}`">
        <div class="name">
            {{ task.name || '' }}
        </div>
    </div>
    <Card ref="draggable"
        :data-id="task.id"
        :style="{ position: isDragging ? 'absolute' : 'static', top: `${y}px`, left: `${x}px` }"
        @mousedown="onClick"
        :class="['draggable', 'task', { 'completed': task.completed }]">
        <template #content>
            <div class="placement-indicator"></div>
            <div class="task-container">
            <Checkbox @click="toggleTaskComplete" v-model="isCompleted" binary/>
            <div class="name">
                {{ task.name || 'No task name' }}
            </div>
        </div>
        </template>
    </Card>
</template>

<style scoped lang="scss">
.edit {
    width: 100%;
    .icon {
        display: block;
        width: 1rem;
        height: 1rem;
    }
}

.task {
    border-radius: 8px;
    padding: 0.5rem;
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: background-color 0.1s ease-in-out;

    box-shadow: none;
    :deep(.p-card-body) {
        padding: 0;
    }
}

.task.completed {
    background-color: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
}

.task-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.enable-placement-indicator {
    .placement-indicator {
        position: relative;
        &:before {
            content: '';
            width: 100%;
            height: 2px;
            background-color: var(--p-primary-color);
            position: absolute;
            top: -12px;
        }
    }
}

.placeholder {
    border-radius: 8px;
    background-color: white;
    padding: 0.5rem 1rem;
    display: none;

    &.dragging {
        display: block;
        opacity: 0;
    }
}
</style>
