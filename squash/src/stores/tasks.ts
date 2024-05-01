// store/tasks.js
import { defineStore } from 'pinia';
import type { Task, GroupedTasks } from '@/types';
import { groupTasksByDate } from '@/utils/tasks';
import dayjs from 'dayjs';

const getHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Authorization': `Bearer ${token}`
    }
}

export const useTasksStore = defineStore('tasks', {
    state: () => ({
        tasks: {} as GroupedTasks,
        taskRanks: {} as any,
        currentDraggedTask: null as Task | null,
        editModal: {
            isOpen: false,
            task: null,
        }
    }),
    actions: {
        async getTasks() {
            try {
                const token = localStorage.getItem('accessToken');

                //construct URL with query parameters
                const start = dayjs().day(1).format('YYYY-MM-DD');
                const end = dayjs().day(7).format('YYYY-MM-DD');

                const data = await fetch(`/api/tasks?start=${start}&end=${end}`, { headers: getHeaders() })
                    .then(response => response.json())

                this.tasks = groupTasksByDate(data);
                console.log(this.tasks)

                const dataRanks = await fetch(`/api/tasks_ranks?start=${start}&end=${end}`, { headers: getHeaders() })
                    .then(response => response.json())
                console.log(this.taskRanks)
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
                        'Content-Type': 'application/json',
                        ...getHeaders()
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
                const date = (newTask.date ? dayjs(newTask.date) : dayjs()).format('YYYY-MM-DD');
                const response = await fetch('http://localhost:3000/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getHeaders()
                    },
                    body: JSON.stringify({
                      task: {
                        name: newTask.name,
                        completed: newTask.completed,
                        description: "A placeholder description",
                        date: date,
                      }})
                  }).then(response => response.json())

                const taskDate = dayjs(response.date).format('YYYY-MM-DD');
                const tasksOnDate = this.tasks[taskDate] || [];
                this.tasks[taskDate] = [...tasksOnDate, response];

                await this.updateTaskRanks([...this.taskRanks[date] || [], response.id], date)

                return response;
            } catch (error) {
                console.error('Error adding task:', error);
            }
        },
        async updateTask(updatedTask: Task, newRankedAbove: number | null = null) {
            console.log(updatedTask);
            try {
                fetch('http://localhost:3000/tasks', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getHeaders()
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
        async deleteTask(taskId: number, date: string) {
            try {
                const response = await fetch(`http://localhost:3000/tasks?id=${taskId}&date=${date}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getHeaders()
                    },
                })

                this.updateTaskRanks(this.taskRanks[date].filter((rank: number) => rank !== taskId), date)

                // TODO: error handling
                console.log(response)
                // this.tasks = this.tasks.filter(task => task.id !== taskId);
                // Object.keys(this.tasks).forEach(date => {
                //     this.tasks[date] = this.tasks[date].filter(task => task.id !== taskId);
                // })
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        },
        updateCurrentDraggedTask(task: Task | null) {
            this.currentDraggedTask = task;
        }
    },
});
