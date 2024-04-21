import { Task, TaskInput, TaskRanks, TaskRanksDB } from "@types";
import db from "@db/supabase.manager";
import dayjs from 'dayjs';
import { groupTasksByDate } from "@utils/tasks";

const tasks: any = [
  { id: 1, name: "Task 1", description: "This is task 1", status: "OPEN" },
  { id: 2, name: "Task 2", description: "This is task 2", status: "IN_PROGRESS" },
  { id: 3, name: "Task 3", description: "This is task 3", status: "DONE" },
]

interface TaskQueryParams {
  start: string | null;
  end: string | null;
}

const getTasks = async (params: TaskQueryParams): Promise<Task[]> => {
  
  const { data, error } = await db.from('tasks').select('*');
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

  const { data, error } = await db.from('tasks').insert(newTask).select();

  if (error) {
    throw error;
  }

  return data[0];
}


const deleteTask = async (taskId: string): Promise<boolean> => {
  const { error } = await db.from('tasks').delete().eq('id', taskId);

  if(error) {
    throw error;
  }

  return Promise.resolve(true);
}

const updateTask = async (updatedTask: Task): Promise<Task> => {
  console.log(updatedTask);

  const { data, error } = await db.from('tasks').update(updatedTask).eq('id', updatedTask.id).select();
  console.log('updating task')
  if (error) {
    throw error;
  }

  return data[0];

}

const getTaskRanks = async (params: TaskQueryParams): Promise<TaskRanksDB[]> => {
  
  const { data, error } = await db.from('task_ranks').select('*');

  if (error) {
    throw error;
  }

  return data;
}

const updateTaskRanks = async(newRanks: any, key: string): Promise<TaskRanksDB> => {
  const { data, error } = await db.from('task_ranks').upsert({ ranks: newRanks, date: key}, { onConflict: 'date'}).eq('date', key).select();
  
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