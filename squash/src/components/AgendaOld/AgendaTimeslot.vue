<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '../../types';
import Draggable from 'vuedraggable';
import dayjs from 'dayjs';
import { useTasksStore } from '../../stores/tasks.legacy';
import AgendaTask from './AgendaTask.vue';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const store = useTasksStore();
const props = defineProps<{
  tasks: Task[];
  date: dayjs.Dayjs;
  time: number;
}>();

const draggableItems = computed({
  get: () => {
    const tasks = props.tasks.filter(
      (t) => dayjs(t.start).hour() < props.time + 1 && dayjs(t.start).hour() >= props.time,
    );
    const quarterlyTasks = {
      1: [],
      2: [],
      3: [],
      4: [],
    };

    tasks.forEach((task) => {
      const start = dayjs(task.start);
      const startQuarter = Math.floor(start.minute() / 15) + 1;

      //check if any of the tasks in the tasks array are within 15 minutes ahead of the current task
      const canExtend = props.tasks.filter((t) => {
        return dayjs(t.start).isBetween(start, start.add(16, 'minute'));
      });

      quarterlyTasks[startQuarter].push({
        ...task,
        canExtend: canExtend.length === 0,
      });
    });

    return quarterlyTasks;
  },
  set: () => {},
});

const updateTask = (e: any, quarter: number) => {
  const { added } = e;

  if (!added) {
    return;
  }

  const newDate = props.date
    .hour(props.time)
    .minute((quarter - 1) * 15)
    .second(0)
    .millisecond(0);
  const taskLength = added.element.end
    ? dayjs(added.element.end || added.element.start).diff(added.element.start, 'minute')
    : 15;

  store.updateTask({
    id: added.element.id,
    start: newDate.format(),
    end: dayjs(newDate).add(taskLength, 'minute').format(),
  });
  //
};

const shortenTask = (task: Task) => {
  store.updateTask({
    id: task.id,
    end: dayjs(task.end || task.start)
      .subtract(15, 'minute')
      .format(),
  });
};

const extendTask = (task: Task) => {
  store.updateTask({
    id: task.id,
    end: dayjs(task.end || task.start)
      .add(15, 'minute')
      .format(),
  });
};
</script>

<template>
  <div class="timeslot">
    <div class="time-wrapper">
      <!-- <h4>{{ time }}</h4> -->
    </div>
    <Draggable
      v-for="quarter in Object.keys(draggableItems)"
      v-model="draggableItems[quarter]"
      group="tasks"
      @change="(e) => updateTask(e, parseInt(quarter))"
      class="drag-zone"
      :key="quarter"
      item-key="id">
      <template #item="{ element }">
        <AgendaTask :task="element" @extendTask="extendTask" @shortenTask="shortenTask" />
      </template>
    </Draggable>
  </div>
</template>

<style scoped lang="scss">
.timeslot {
  width: 100%;
  height: 100%;

  // &:not(:hover) {
  //   color: transparent;
  // }
  h4 {
    font-size: 24px;
  }
  margin: 1px;
  border-bottom: 1px solid rgb(222, 222, 222);
}

.time-wrapper {
  // position: absolute;
  // text-align: center;
  // padding: 0 auto;
  // width: 2rem;
}

.drag-zone {
  height: 25%;
  border-bottom: 1px solid rgb(238, 238, 238);
}
</style>
