<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { onMounted, ref, computed } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import Task from '@/components/Agenda/Task.vue';
import type { Task as TaskType } from '@/types';
import DashboardWidget from './DashboardWidget.vue';

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

	return (store.taskRanks[dayjs().format('YYYY-MM-DD')] || []).map((taskId: number) => tasks.find((task: TaskType) => task.id === taskId) || {})
	// .sort((a, b) => a.rank - b.rank)
})

const loading = computed(() => !Object.keys(store.tasks).length);
</script>

<template>
	<DashboardWidget title="Today's Items" to="/agenda" icon="check-circle">
		<div class="task-list" v-if="!loading">
			<Task v-for="task in today" :task="task" disableEditing/>
		</div>
		<div class="task-list" v-else>
			<Skeleton height="30px" width="100%" v-for="i in 3" :key="i"/>
		</div>
	</DashboardWidget>
</template>

<style lang="scss" scoped>
.task-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

</style>