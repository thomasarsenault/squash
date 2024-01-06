import ClientResponse from '@middleware/clientResponse';
import taskService from '@services/tasks.service';
import { Task } from '@types';

const getTasks = async (req: Request) => {
    const tasks: Task[] = await taskService.getTasks();

    return new ClientResponse(JSON.stringify(tasks), { status: 200 });
}

const createTask = async (req: Request) => {
    const data: any = await req.json();
    const task: Task = await taskService.createTask(data.task);

    return new ClientResponse(JSON.stringify(task), { status: 200 });
}

const deleteTask = async (req: Request) => {
    const url = new URL(req.url);
    const { id } = Object.fromEntries(url.searchParams.entries());

    const res = await taskService.deleteTask(id);

    if(!res) {
        return new ClientResponse(null, { status: 404 });
    }

    return new ClientResponse(null, { status: 204 });
}

const updateTask = async (req: Request) => {
    const data: any = await req.json();
    const task: Task = await taskService.updateTask(data.task);

    return new ClientResponse(JSON.stringify(task), { status: 200 });
}

export default {
    getTasks,
    createTask,
    deleteTask,
    updateTask
}