import { Task, TaskInput } from "@types";
import db from "@db/supabase.manager";

const tasks: any = [
  { id: 1, name: "Task 1", description: "This is task 1", status: "OPEN" },
  { id: 2, name: "Task 2", description: "This is task 2", status: "IN_PROGRESS" },
  { id: 3, name: "Task 3", description: "This is task 3", status: "DONE" },
]

const getTasks = async (): Promise<Task[]> => {
  const { data, error } = await db.from('tasks').select('*');
  
  return data ?? [];
}

const createTask = async (newTask: TaskInput): Promise<Task> => {
  console.log('creating a task')
  console.log(newTask);
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


export default {
  getTasks,
  createTask,
  deleteTask
};