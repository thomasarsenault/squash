<script setup lang="ts">
import dayjs from 'dayjs'
import { useTasksStore } from '../../stores/tasks';
import type { Task } from '../../types';
import { computed } from 'vue';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';

const props = defineProps<{
  task: Task & { canExtend: boolean}
}>()

const emit = defineEmits(['extendTask', 'shortenTask']);

const canShorten = computed(() => dayjs(props.task.end).isAfter(dayjs(props.task.start).add(15, 'minute')))
const lengthInQuarters = computed(() => {
  const start = dayjs(props.task.start);
  const end = dayjs(props.task.end);

  return Math.ceil(end.diff(start, 'minute') / 15);
})

</script>

<template>
  <div class="task" :style="{ height: `${lengthInQuarters * 100}%`}">
    <!-- <md-filled-tonal-button>
        test
    </md-filled-tonal-button>
    <md-filled-button>
        test
    </md-filled-button> -->
    <div class="name">
        {{ task.name || 'nah' }}
    </div>
    <div v-if="task.canExtend" class="time-change add" @click="emit('extendTask', task)">
        <font-awesome-icon icon="fa-solid fa-plus" size="xs" :style="{ color: 'white' }"/>
    </div>
    <div v-if="canShorten" class="time-change subtract" @click="emit('shortenTask', task)">
        <font-awesome-icon icon="fa-solid fa-minus" size="xs" :style="{ color: 'white' }"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task {
    border-radius: 8px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: opacity 0.5 ease-in-out;
    background-color: var(--md-sys-color-surface);
    background-color: var(--md-sys-color-surface-container-high);

    &:hover {
        & .time-change {
            opacity: 1;
        }
    }
}

.time-change {
    background-color: #b8e6ff;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    position: absolute;
    top: -7px;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: opacity 0.5s ease-in-out;
    opacity: 0;

    &:hover {
        background-color: #abe0fd;
    }

    &.subtract {
        right: 12px;
    }
    &.add {
        right: -5px;
        top: -7px;
    }
}
</style>
