import { defineStore } from 'pinia';
import Stan from '../utils/stan';
import WORKOUT_TYPES from '@/data/workoutTypes';
import type { Workout, WorkoutInput } from '@/types/Fitness';
import type { Dayjs } from 'dayjs';

export const useFitnessStore = defineStore('fitness', {
  state: () => ({
    workouts: [] as Workout[],
    workoutTypes: WORKOUT_TYPES,
    modalOpen: false,
    editModal: {
      open: false,
      workout: {} as Workout,
    },
    dayModal: {
      open: false,
      date: null as Dayjs | null,
    },
  }),
  actions: {
    async getWorkouts() {
      try {
        const data = await Stan(`fitness`);

        if (data.error) {
          throw data.error;
        }

        this.workouts = data;
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    },
    async addWorkout(newWorkout: WorkoutInput) {
      try {
        console.log(newWorkout);
        const response = await Stan(`fitness`, {
          method: 'POST',
          body: JSON.stringify({
            workout: newWorkout,
          }),
        });

        this.workouts.push(response);

        return response;
      } catch (error) {
        console.error('Error adding workout:', error);
      }
    },
    async updateWorkout(workout: Workout) {
      try {
        const response = await Stan(`fitness`, {
          method: 'PUT',
          body: JSON.stringify({
            workout,
          }),
        });

        const index = this.workouts.findIndex((t: any) => t.id === response.id);

        this.workouts[index] = response;

        console.log('updated workout', workout);
        return response;
      } catch (error) {
        console.error('Error editing workout:', error);
      }
    },
    async deleteWorkout(workout: Workout) {
      try {
        const response = await Stan(`/fitness?id=${workout.id}`, {
          method: 'DELETE',
        });

        const index = this.workouts.findIndex((t: any) => t.id === workout.id);
        this.workouts.splice(index, 1);

        return response;
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    },
  },
  getters: {
    dropdownTypes: (state) => {
      return state.workoutTypes.map((type) => {
        return {
          label: type.name,
          value: type.name,
        };
      });
    },
  },
});
