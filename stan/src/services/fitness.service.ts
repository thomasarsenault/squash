import { Task, TaskInput, TaskRanks, TaskRanksDB } from "@types";
import db from "@db/supabase.manager";

interface TaskQueryParams {
	start: string | null;
	end: string | null;
}

const getWorkouts = async (params: TaskQueryParams): Promise<Task[]> => {
	
	const { data, error } = await db.from('workouts').select('*');
	
	if(error) {
		throw error;
	}

	return data;
}

const createWorkout = async (newWorkout: any): Promise<Task> => {
	console.log('creating a workout')
	console.log(newWorkout);

	const { data, error } = await db.from('workouts').insert(newWorkout).select();

	if (error) {
		throw error;
	}

	return data[0];
}

const deleteWorkout = async (workoutId: string): Promise<number> => {
	console.log('deleting workout')
	let { error } = await db.from('workouts').delete().eq('id', workoutId);

	if(error) {
		throw error;
	}

	return Promise.resolve(Number(workoutId));
}

const updateWorkout = async (updatedWorkout: any): Promise<Task> => { 
	console.log('updating workout')
	console.log(updatedWorkout);

	const { data, error } = await db.from('workouts').update(updatedWorkout).eq('id', updatedWorkout.id).select();

	if (error) {
		throw error;
	}

	return data[0];
 };

export default {
	getWorkouts,
	createWorkout,
	deleteWorkout,
	updateWorkout,
};