<script setup lang="ts">
import dayjs from 'dayjs'
import { useTasksStore } from '../stores/tasks';
import type { Task } from '../types';
import { computed, ref } from 'vue';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';

const props = defineProps<{
  task: Task
}>()

const store = useTasksStore();

const emit = defineEmits(['drag', 'dragEnd']);


const draggable = ref(null);
const isDragging = ref(false);
const x = ref(0);
const y = ref(0);
const offsetX = ref(0);
const offsetY = ref(0);

const startDrag = (e) => {
    console.log('start drag', e)
    isDragging.value = true;
    x.value = e.clientX;
    y.value = e.clientY;
    offsetX.value = e.clientX - x.value;
    offsetY.value = e.clientY - y.value;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    store.updateCurrentDraggedTask(props.task);
}

const drag = (e) => {
    // if (!isDragging.value) return;
    // x.value = e.clientX - offsetX.value;
    // y.value = e.clientY - offsetY.value;
    emit('drag', e)
    x.value = e.clientX;
    y.value = e.clientY;
}

const endDrag = () => {
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
            :style="{ position: isDragging ? 'absolute' : 'static', top: `${y}px`, left: `${x}px` }"
        @mousedown="startDrag"
        class="draggable task">
        <!-- <md-filled-tonal-button>
            test
        </md-filled-tonal-button>
        <md-filled-button>
            test
        </md-filled-button> -->
        <div class="name">
            {{ task.name || 'nah' }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.task {
    border-radius: 8px;
    background-color: var(--md-sys-color-outline);
    background-color: var(--md-sys-color-on-tertiary-fixed-variant);
    padding: 1rem;
    cursor: pointer;
    user-select: none;
    color: white;
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
