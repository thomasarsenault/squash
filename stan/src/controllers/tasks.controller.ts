import ClientResponse from '@middleware/clientResponse';
import taskService from '@services/tasks.service';
import { Task, TaskRanks, TaskRanksDB } from '@types';
import dayjs from 'dayjs';

const getTasks = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const tasks: Task[] = await taskService.getTasks({ start, end});

    return new ClientResponse(JSON.stringify(tasks), { status: 200 });
}

const createTask = async (req: Request) => {
    const data: any = await req.json();
    const task: Task = await taskService.createTask(data.task);

    return new ClientResponse(JSON.stringify(task), { status: 200 });
}

const deleteTask = async (req: Request) => {
    const url = new URL(req.url);
    const { id, date } = Object.fromEntries(url.searchParams.entries());

    const res = await taskService.deleteTask(id, date);

    if(!res) {
        return new ClientResponse(null, { status: 404 });
    }

    console.log('returning new task ranks', res)
    return new ClientResponse(null, { status: 204 });
}

const updateTask = async (req: Request) => {
    const data: any = await req.json();
    const task: Task = await taskService.updateTask(data.task);

    return new ClientResponse(JSON.stringify(task), { status: 200 });
}

const getTaskRanks = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const taskRanksArray = await taskService.getTaskRanks({ start, end});

    const taskRanks: TaskRanks = {};
    taskRanksArray.forEach((taskRank) => {
        taskRanks[dayjs(taskRank.date).format('YYYY-MM-DD')] = taskRank.ranks;
    });
    
    return new ClientResponse(JSON.stringify(taskRanks), { status: 200 });
}

const updateTaskRanks = async (req: Request) => {
    console.log('req', req)
    const data: any = await req.json();
    const taskRanks = await taskService.updateTaskRanks(data.newRanks, data.key);

    return new ClientResponse(JSON.stringify({ newTaskRanks: taskRanks}), { status: 200 });
}

export default {
    getTasks,
    createTask,
    deleteTask,
    updateTask,
    getTaskRanks,
    updateTaskRanks
}