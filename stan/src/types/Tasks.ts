export type Task = {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
}

type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';