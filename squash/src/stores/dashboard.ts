// store/tasks.js
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import Stan from '../utils/stan';

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        weather: {
            current: {},
            days: {}
        } as any,
    }),
    actions: {
        async getDashboard() {
            try {
                const data = await Stan(`dashboard`);
                const today = dayjs().format('YYYY-MM-DD');
                
                console.log('store data', data)
                this.weather = data.weather;
                // this.weather = JSON.parse(test).weather;
                this.weather.current.sunset = this.weather.days[today].sunset;
                this.weather.current.sunrise = this.weather.days[today].sunrise
            } catch (error) {
                console.error('Error fetching dashboard info:', error);
            }
        }
    },
});