import { useContext } from 'react';

import { TasksContext } from '../context/TasksContext';

const useTasks = () => {
    const { tasks, setTasks } = useContext(TasksContext);

    const fetchTasks = async () => {
        fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(data => setTasks(data));
    };

    const addTask = async (task) => {
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              task: {
                name: task.name,
                status: task.status || 'OPEN',
                description: "A placeholder description"
              }})
          }).then(response => response.json())
            .then(data => setTasks([...tasks, data]));
    };

    const updateTask = async (updatedTask) => {
        fetch('http://localhost:3000/tasks', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task: updatedTask
                })
        })
        // .then(response => response.json())
        // .then(() => {
        //     // should probably do something if it errors out, like resetting the state
        // });

        const updatedTasks = tasks.map(task => {
            if(task.id === updatedTask.id) {
                return { ...task, ...updatedTask };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const deleteTask = async (taskId) => {
        // Logic to delete a task
        // The id will be passed in as a query parameter to the /tasks route with the DELETE method
        fetch(`http://localhost:3000/tasks?id=${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
                }
        }).then(() => {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);
        })

    };

    return { tasks, fetchTasks, addTask, updateTask, deleteTask };
};

export default useTasks;