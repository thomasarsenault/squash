import dayjs from 'dayjs';
import { useContext } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { TasksContext } from '../../context/TasksContext';
import Styles from './Agenda.module.scss';
import Day from './components/Day';

const Agenda = () => {
    const { tasks } = useContext(TasksContext);

    return <DndProvider backend={HTML5Backend}>
        <div className={Styles['agenda']}>
            <div className={Styles['tasks']}>
                <Day day={dayjs().day(1)} tasks={tasks.filter(task => dayjs(task.start).day() === 1)} />
                <Day day={dayjs().day(2)} tasks={tasks.filter(task => dayjs(task.start).day() === 2)} />
                <Day day={dayjs().day(3)} tasks={tasks.filter(task => dayjs(task.start).day() === 3)} />
                <Day day={dayjs().day(4)} tasks={tasks.filter(task => dayjs(task.start).day() === 4)} />
                <Day day={dayjs().day(5)} tasks={tasks.filter(task => dayjs(task.start).day() === 5)} />
                <Day day={dayjs().day(6)} tasks={tasks.filter(task => dayjs(task.start).day() === 6)} />
                <Day day={dayjs().day(7)} tasks={tasks.filter(task => dayjs(task.start).day() === 0)} />
            </div>
        </div>
    </DndProvider>
}

export default Agenda;