import { createContext, useEffect,useState } from 'react';

import { Task as TaskType } from '../types';

interface TasksContextProps {
    tasks: TaskType[];
    setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
    // Add other context methods like addTask, deleteTask, updateTask etc.
}

export const TasksContext = createContext<TasksContextProps>({
    tasks: [],
    setTasks: () => {},
});

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState<TaskType[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/tasks')
            .then(response => response.json())
            .then(data => setTasks(data));
    }, []);

    return (
        <TasksContext.Provider value={{ tasks, setTasks }}>
            {children}
        </TasksContext.Provider>
    );
};