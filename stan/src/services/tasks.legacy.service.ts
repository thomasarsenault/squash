import { Task, TaskInput, TaskRanks, TaskRanksDB } from "@types";
import db from "@db/supabase.manager";

interface TaskQueryParams {
	start: string | null;
	end: string | null;
}

const getTasks = async (params: TaskQueryParams): Promise<Task[]> => {
	
	const { data, error } = await db.from('tasks_legacy').select('*');
	// const start = dayjs(params.start || dayjs().day(1).format('YYYY-MM-DD')).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
	// const end = dayjs(params.end || dayjs().day(7).format('YYYY-MM-DD')).endOf('day').format('YYYY-MM-DDTHH:mm:ss');

	// // Making two DB calls cuz I could not be bothered combining them with the ORM. Do I even like Supabase?
	// const { data, error } = await db.from('tasks').select('*').gte('start', start).lte('start', end);
	// const { data: nullStartData, error: nullStartError } = await db.from('tasks').select('*').is('start', null);



	if (error) {
		throw error;
	}

	return data;
	
	// return groupTasksByDate([...data, ...nullStartData]) ?? {};
}

const createTask = async (newTask: TaskInput): Promise<Task> => {
	console.log('creating a task')
	console.log(newTask);

	// //query the DB and find the lowest rank field based on the date of this new task
	// const { data: dataRank, error: errorRank } = await db.from('tasks')
	//   .select('rank')
	//   .eq('start', newTask.start)
	//   .order('rank', { ascending: false })
	//   .limit(1);
	
	// if (errorRank) {
	//   throw errorRank;
	// }

	// newTask.rank = dataRank[0]?.rank + 1 || 1;

	const { data, error } = await db.from('tasks_legacy').insert(newTask).select();

	if (error) {
		throw error;
	}

	return data[0];
}


const deleteTask = async (taskId: string, date: string): Promise<number> => {
	console.log('deleting task')
	let { error } = await db.from('tasks_legacy').delete().eq('id', taskId);

	// const {data, error: taskRanksError } = await db.from('task_ranks').select('*').eq('date', date)

	// if(taskRanksError) {
	//   throw error;
	// }

	// const newRanks = data[0].ranks.filter((rank: string) => rank !== taskId);

	// console.log(newRanks);
	// const { data: updatedTaskRanks, error: updateTaskRanksError } = await db.from('task_ranks').upsert({ ranks: newRanks, date: date}, { onConflict: 'date'}).eq('date', date).select();

	// if(updateTaskRanksError) {
	//   throw error;
	// }

	if(error) {
		throw error;
	}

	return Promise.resolve(Number(taskId));
}

const updateTask = async (updatedTask: Task): Promise<Task> => {
	console.log(updatedTask);

	const { data, error } = await db.from('tasks_legacy').update(updatedTask).eq('id', updatedTask.id).select();
	console.log('updating task')
	console.log(updatedTask)
	console.log('updated data', data)
	console.log('error', error);
	
	if (error) {
		throw error;
	}

	console.log(data[0])
	return data[0];

}

const getTaskRanks = async (params: TaskQueryParams): Promise<TaskRanksDB[]> => {
	
	const { data, error } = await db.from('task_ranks_legacy').select('*');

	if (error) {
		throw error;
	}

	return data;
}

const updateTaskRanks = async(newRanks: any, key: string): Promise<TaskRanksDB> => {
	const { data, error } = await db.from('task_ranks_legacy').upsert({ ranks: newRanks, date: key}, { onConflict: 'date'}).eq('date', key).select();
	
	if(error) {
		throw error;
	}

	return data[0];
}

export default {
	getTasks,
	createTask,
	deleteTask,
	updateTask,
	getTaskRanks,
	updateTaskRanks
};