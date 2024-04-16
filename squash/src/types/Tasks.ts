export type Task = {
    id: number;
    created_at: Date;
    modified_at: Date;
    name: string;
    description?: string;
    status: TaskStatus;
    start: Date;
    end?: Date;
}

export type TaskInput = {
    name: string;
    description?: string;
    status: TaskStatus;
    start?: Date;
    end?: Date;
}

// TODO: remove this
export type GroupedTasks = Record<string, Task[]>;

type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';