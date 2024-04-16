// store/tasks.js
import { defineStore } from 'pinia';
import type { Task, GroupedTasks } from '@/types';
import { groupTasksByDate } from '@/utils/tasks';
import dayjs from 'dayjs';
export const useTasksStore = defineStore('tasks', {
    state: () => ({
        tasks: {} as GroupedTasks,
        currentDraggedTask: null as Task | null,
    }),
    actions: {
        async getTasks() {
            try {
                //construct URL with query parameters
                const start = dayjs().day(1).format('YYYY-MM-DD');
                const end = dayjs().day(7).format('YYYY-MM-DD');

                const data = await fetch(`/api/tasks?start=${start}&end=${end}`)
                .then(response => response.json())
                console.log(data);
                this.tasks = groupTasksByDate(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        },
        async addTask(newTask: Task) {
            try {
                const response = await fetch('http://localhost:3000/tasks', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      task: {
                        name: newTask.name,
                        status: newTask.status || 'OPEN',
                        description: "A placeholder description",
                        start: newTask.start || new Date(),
                      }})
                  }).then(response => response.json())

                  console.log('response.data', response);
                // this.tasks.push(response);
                console.log(this.tasks);
                const taskDate = dayjs(response.start).format('YYYY-MM-DD');
                const tasksOnDate = this.tasks[taskDate] || [];
                this.tasks[taskDate] = [...tasksOnDate, response];
            } catch (error) {
                console.error('Error adding task:', error);
            }
        },
        async updateTask(updatedTask: Task) {
            try {
                fetch('http://localhost:3000/tasks', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            task: updatedTask
                        })
                })
                // TODO: handle it erroring out

                // const updatedTasks = this.tasks.map(task => {
                //     if(task.id === updatedTask.id) {
                //         return { ...task, ...updatedTask };
                //     }
                //     return task;
                // });
                // this.tasks = updatedTasks;

                const tasks = Object.values(this.tasks).reduce((acc, tasks) => [...acc, ...tasks], []);
                const updatedTasks = tasks.map(task => {
                    if(task.id === updatedTask.id) {
                        return { ...task, ...updatedTask };
                    }
                    return task;
                });
                this.tasks = groupTasksByDate(updatedTasks);

            } catch (error) {
                console.error('Error updating task:', error);
            }
        },
        async deleteTask(taskId: number) {
            try {
                fetch(`http://localhost:3000/tasks?id=${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                        }
                })
                // TODO: error handling
                // this.tasks = this.tasks.filter(task => task.id !== taskId);
                Object.keys(this.tasks).forEach(date => {
                    this.tasks[date] = this.tasks[date].filter(task => task.id !== taskId);
                })
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        },
        updateCurrentDraggedTask(task: Task | null) {
            this.currentDraggedTask = task;
        }
    },
});
