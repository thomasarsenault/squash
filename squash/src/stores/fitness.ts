import { defineStore } from 'pinia';
import Stan from '../utils/stan';
import WORKOUT_TYPES from '@/data/workoutTypes';

export const useFitnessStore = defineStore('fitness', {
    state: () => ({
        workouts: [] as any,
        workoutTypes: WORKOUT_TYPES,
        modalOpen: false,
        editModal: {
            open: false,
            workout: {}
        }
    }),
    actions: {
        async getWorkouts() {
            try {
                const data = await Stan(`fitness`);

                if(data.error) {
                    throw data.error;
                }

                const workoutsWithColors = data.map(workout => {
                    const color = WORKOUT_TYPES.find(w => w.name === workout.type)?.color || '#eeeeee'

                    return {
                        ...workout,
                        color
                    }
                })
                this.workouts = workoutsWithColors;
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        },
        async addWorkout(newWorkout: any) {
            try {
                console.log(newWorkout);
                const response = await Stan(`fitness`, {
                    method: 'POST',
                    body: JSON.stringify({
                        workout: newWorkout
                    })
                });

                const color = WORKOUT_TYPES.find(w => w.name === response.type)?.color || '#ffffff';

                (this.workouts as any).push({ ...response, color });

                return response;
            } catch (error) {
                console.error('Error adding workout:', error);
            }
        },
        async updateWorkout(workout: any) {
            try {
                const response = await Stan(`fitness`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        workout
                    })
                });

                const index = (this.workouts as any).findIndex((t: any) => t.id === response.id);
                const color = WORKOUT_TYPES.find(w => w.name === response.type)?.color || '#ffffff';

                (this.workouts as any)[index] = { ...response, color };

                console.log('updated workout', workout)
                return response;
            } catch (error) {
                console.error('Error editing workout:', error);
            }
        },
        async deleteWorkout(workout: any) {
            try {
                const response = await Stan(`/fitness?id=${workout.id}`, {
                    method: 'DELETE',
                });

                const index = (this.workouts as any).findIndex((t: any) => t.id === workout.id);
                (this.workouts as any).splice(index, 1);

                return response;
            } catch (error) {
                console.error('Error deleting workout:', error);
            }
        }
    },
    getters: {
        dropdownTypes: (state) => {
            return state.workoutTypes.map((type) => {
                return {
                    label: type.name,
                    value: type.name,
                    color: type.color,
                }
            });
        }
    }
});
