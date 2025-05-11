<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks.legacy';
import type { Task } from '@/types';
import { ref, watch } from 'vue';

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

const isCompleted = ref(props.task.completed);

watch(isCompleted, () => {
    store.updateTask({id: props.task.id, completed: isCompleted.value});
})
// const isCompleted = computed(() => props.task.completed);
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
        :class="['draggable', 'task', { 'completed': isCompleted }]">
        <template #content>
            <div class="placement-indicator"></div>
            <div class="task-container">
            <Checkbox v-model="isCompleted" binary/>
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
    
    :deep(.p-checkbox-box) {
        border-color: var(--p-violet-200);
        background: var(--p-violet-200);
    }

    :deep(.p-checkbox-checked .p-checkbox-box) {
        border-color: var(--p-violet-300);
        background: var(--p-violet-300);
    }
}

.task.completed {
    background-color: var(--p-violet-50);
    background: none;
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
    background-color: var(--p-card-background);
    padding: 0.5rem 1rem;
    display: none;

    &.dragging {
        display: block;
        opacity: 0;
    }
}
</style>
