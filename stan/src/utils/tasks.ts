import dayjs from 'dayjs';
import { Task } from "@types";

// TODO: remove this
export function groupTasksByDate(tasks: Task[]) {
    return tasks.reduce((acc, task) => {
        let date;

        if(task.date) {
            date = dayjs(task.date).format('YYYY-MM-DD');
        } else {
            date = 'backlog';
        }
        
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(task);
        return acc;
    }, {} as Record<string, Task[]>);
}