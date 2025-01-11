export interface Workout {
    id: number,
    start: string,
    end?: string,
    type: string,
    date: string,
    notes?: string,
    created_at: string
}

export interface WorkoutInput {
    start: string,
    end?: string,
    type?: string,
    date: string,
    notes?: string
}