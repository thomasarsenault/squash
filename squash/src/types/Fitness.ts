export interface Workout {
    id: number,
    type: string,
    date: string,
    notes?: string,
    created_at: string
}

export interface WorkoutInput {
    type?: string,
    date: string,
    notes?: string
}