<script setup lang="ts">
import dayjs from 'dayjs'
import { useTasksStore } from '../stores/tasks';
import type { Task } from '../types';
import { computed, ref } from 'vue';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/text-button.js';
import '@material/web/checkbox/checkbox.js';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import EditTask from './EditTask.vue';
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
    if(e.target.classList.contains('checkbox')) return;
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
    store.updateTask({id: props.task.id, completed: !props.task.completed});
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
    <div
        ref="draggable"
        :data-id="task.id"
            :style="{ position: isDragging ? 'absolute' : 'static', top: `${y}px`, left: `${x}px` }"
        @mousedown="onClick"
        :class="['draggable', 'task', { 'completed': task.completed }]">
        <div class="placement-indicator"></div>
        <!-- <md-filled-tonal-button>
            test
        </md-filled-tonal-button>
        <md-filled-button>
            test
        </md-filled-button> -->
        <div class="task-container">
            <md-checkbox @click="toggleTaskComplete" :checked="task.completed" class="checkbox"/>
            <div class="name">
                {{ task.name || 'nah' }}
            </div>
        </div>
    </div>
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
    background-color: var(--md-sys-color-outline);
    padding: 1rem;
    cursor: pointer;
    user-select: none;
    color: white;
    position: relative;
    transition: background-color 0.1s ease-in-out;
}

.task.completed {
    background-color: var(--md-sys-color-outline-variant);
    color: gray;
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
            background-color: var(--md-sys-color-outline);
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
