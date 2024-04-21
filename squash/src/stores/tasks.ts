// store/tasks.js
import { defineStore } from 'pinia';
import type { Task, GroupedTasks } from '@/types';
import { groupTasksByDate } from '@/utils/tasks';
import dayjs from 'dayjs';
export const useTasksStore = defineStore('tasks', {
    state: () => ({
        tasks: {} as GroupedTasks,
        taskRanks: {} as any,
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

                this.tasks = groupTasksByDate(data);

                const dataRanks = await fetch(`/api/tasks_ranks?start=${start}&end=${end}`)
                .then(response => response.json())

                this.taskRanks = dataRanks
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        },
        async updateTaskRanks(newRanks: any, key: string) {
            console.log('updating task ranks')
            this.taskRanks[key] = newRanks;
            try {
                const response = await fetch('http://localhost:3000/tasks_ranks', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ newRanks: newRanks, key: key })
                }).then(response => response.json())

                // TODO: handle it erroring out
                return response;
            } catch (error) {
                console.error('Error updating task:', error);
            }
        },
        async addTask(newTask: Task) {
            try {
                const date = (newTask.start ? dayjs(newTask.start) : dayjs()).format('YYYY-MM-DD');
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
                        start: date,
                      }})
                  }).then(response => response.json())

                const taskDate = dayjs(response.start).format('YYYY-MM-DD');
                const tasksOnDate = this.tasks[taskDate] || [];
                this.tasks[taskDate] = [...tasksOnDate, response];

                await this.updateTaskRanks([...this.taskRanks[date] || [], response.id], date)

                return response;
            } catch (error) {
                console.error('Error adding task:', error);
            }
        },
        async updateTask(updatedTask: Task, newRankedAbove: number | null = null) {
            console.log(newRankedAbove)
            try {
                fetch('http://localhost:3000/tasks', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            task: updatedTask,
                            newRankedAbove: newRankedAbove
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
