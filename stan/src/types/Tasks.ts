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

export type TaskRanksDB = {
    date: Date;
    ranks: number[];
}

export type TaskRanks = {
    [key: string]: number[];
}

type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';