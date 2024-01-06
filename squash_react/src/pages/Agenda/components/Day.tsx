import dayjs from 'dayjs';
import { useState } from 'react';
import { useDrop } from 'react-dnd';

import Task from "../../../components/Task/Task";
import useTasks from '../../../hooks/useTasks';
import { Task as TaskType } from '../../../types';
import { Times } from '../../../utils/constants'
import Styles from './Day.module.scss';


interface Props {
    day: dayjs.Dayjs,
    tasks: TaskType[],
}

const Day = ({ day, tasks }: Props) => {
    const { addTask, updateTask } = useTasks();

    const [{ isOver }, morningDropRef] = useDrop(() => ({
        accept: 'TASK',
        drop: (item: any) => {
            updateTask({id: item.id, start: day.hour(Times.MORNING_END).format() });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }), [day]);

    const [{ isOver: isOverAfternoon }, afternoonDropRef] = useDrop(() => ({
        accept: 'TASK',
        drop: (item: any) => {
            updateTask({id: item.id, start: day.hour(Times.AFTERNOON).format() });
            console.log(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }), [day]);

    const [{ isOver: isOverEvening }, eveningDropRef] = useDrop(() => ({
        accept: 'TASK',
        drop: (item: any) => {
            updateTask({id: item.id, start: day.hour(Times.EVENING_START).format() });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }), [day]);

    const [newTaskName, setNewTaskName] = useState('');

    return (
        <div className={Styles['day']}>
            <h2>{day.format('dddd')}</h2>
            <div className={`${Styles['morning']} ${isOver ? Styles['drop'] : ''}`} ref={morningDropRef}>
                <h3>Morning</h3>
                {tasks.filter(task => dayjs(task.start).isSame(day, 'day') && dayjs(task.start).hour() <= Times.MORNING_END).map(task => <Task key={task.id} task={task} />)}
            </div>
            <div className={Styles['afternoon']} ref={afternoonDropRef} style={{ backgroundColor: isOverAfternoon ? 'lightgray' : 'white' }}>
                <h3>Afternoon</h3>
                {tasks.filter(task => dayjs(task.start).isSame(day, 'day') && dayjs(task.start).hour() > Times.MORNING_END && dayjs(task.start).hour() < Times.EVENING_START).map(task => <Task key={task.id} task={task} />)}
            </div>
            <div className={Styles['evening']} ref={eveningDropRef} style={{ backgroundColor: isOverEvening ? 'lightgray' : 'white' }}>
                <h3>Evening</h3>
                {tasks.filter(task => dayjs(task.start).isSame(day, 'day') && dayjs(task.start).hour() >= Times.EVENING_START).map(task => <Task key={task.id} task={task} />)}
            </div>
            <input type="text" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} />
            <button onClick={() => addTask({name: newTaskName})}>Click Me</button>
        </div>
    )
}

export default Day;