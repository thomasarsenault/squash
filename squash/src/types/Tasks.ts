export type Task = {
    id: number;
    created_at: Date;
    modified_at: Date;
    name: string;
    description?: string;
    completed: boolean;
    date: Date;
    time: string;
}

export type TaskInput = {
    name: string;
    description?: string;
    completed: boolean;
    date: Date;
    time: string;
}

// TODO: remove this
export type GroupedTasks = Record<string, Task[]>;
