import ClientResponse from '@middleware/clientResponse';
import fitnessService from '@services/fitness.service';
import { Task, TaskRanks, TaskRanksDB } from '@types';
import dayjs from 'dayjs';

const getWorkouts = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const workouts: any[] = await fitnessService.getWorkouts({ start, end});

    return new ClientResponse(JSON.stringify(workouts), { status: 200 });
}

const createWorkout = async (req: Request) => {
    const data: any = await req.json();
    const workout: Task = await fitnessService.createWorkout(data.workout);

    return new ClientResponse(JSON.stringify(workout), { status: 200 });
}

const deleteWorkout = async (req: Request) => {
    const url = new URL(req.url);
    const { id } = Object.fromEntries(url.searchParams.entries());

    const res = await fitnessService.deleteWorkout(id);

    if(!res) {
        return new ClientResponse(null, { status: 404 });
    }

    return new ClientResponse(JSON.stringify({ id: res }), { status: 200 });
}

const updateWorkout = async (req: Request) => {
    const data: any = await req.json();
    const workout: Task = await fitnessService.updateWorkout(data.workout);

    return new ClientResponse(JSON.stringify(workout), { status: 200 });
}

export default {
    getWorkouts,
    createWorkout,
    deleteWorkout,
    updateWorkout,
};