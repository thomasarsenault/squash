import { Task } from "@types";

const tasks: any = [
  { id: 1, name: "Task 1", description: "This is task 1", status: "OPEN" },
  { id: 2, name: "Task 2", description: "This is task 2", status: "IN_PROGRESS" },
  { id: 3, name: "Task 3", description: "This is task 3", status: "DONE" },
]

const getTasks = async (): Promise<Task[]> => {
  return Promise.resolve(tasks);
}

const createTask = async (task: any): Promise<Task> => {
  return Promise.resolve(tasks[0]);
}


const deleteTask = async (taskId: string): Promise<boolean> => {
  console.log('deleting:', taskId)
  return Promise.resolve(true);
}


export default {
  getTasks,
  createTask,
  deleteTask
};