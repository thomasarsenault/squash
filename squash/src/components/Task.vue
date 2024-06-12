<script setup lang="ts">
import dayjs from 'dayjs'
import { useTasksStore } from '../stores/tasks';
import type { Task } from '../types';
import { computed, ref } from 'vue';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import EditTask from './EditTask.vue';

import Card from 'primevue/card';

const props = defineProps<{
  task: Task
}>()

const store = useTasksStore();

const emit = defineEmits(['drag', 'dragEnd']);

console.log('task', props.task)

const draggable = ref(null);
const isDragging = ref(false);
const x = ref(0);
const y = ref(0);
const offsetX = ref(0);
const offsetY = ref(0);

const onClick = (e) => {
    console.log(e.target.classList);
    if(e.target.classList.contains('p-checkbox-input')) return;
    if(e.button === 0) {
        console.log('opening modal')
        store.editModal.isOpen = true;
        store.editModal.task = props.task;
        return;
    }

    e.preventDefault();
    startDrag(e);
}

const toggleTaskComplete = () => {
    // TODO: fix the checkbox updating the object before being sent to store
    store.updateTask({id: props.task.id, completed: props.task.completed});
}

const startDrag = (e) => {
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
</script>

<template>
    <div :class="`placeholder ${isDragging ? 'dragging' : ''}`">
        <div class="name">
            {{ task.name || 'nah' }}
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
            <Checkbox @click="toggleTaskComplete" v-model="task.completed" binary/>
            <div class="name">
                {{ task.name || 'nah' }}
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
    padding: 1rem;
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: background-color 0.1s ease-in-out;

    :deep(.p-card-body) {
        padding: 0;
    }
}

.task.completed {
    background-color: var(--primary-color);
    color: var(--primary-color-text);
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
            background-color: var(--primary-color);
            position: absolute;
            top: -20px;
        }
    }
}

.placeholder {
    border-radius: 8px;
    background-color: white;
    padding: 1rem;
    display: none;

    &.dragging {
        display: block;
        opacity: 0;
    }
}
</style>
