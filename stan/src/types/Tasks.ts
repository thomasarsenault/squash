export type Task = {
    id: number;
    created_at: Date;
    modified_at: Date;
    name: string;
    description?: string;
    status: TaskStatus;
}

export type TaskInput = {
    name: string;
    description?: string;
    status: TaskStatus;
}

type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';