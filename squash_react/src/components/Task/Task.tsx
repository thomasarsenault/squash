import 'react-resizable/css/styles.css';

import { useDrag } from 'react-dnd';
import { Resizable, ResizableBox } from 'react-resizable';

import useTasks from '../../hooks/useTasks';
import { Task as TaskType } from '../../types';
import Styles from './Task.module.scss';

interface Props {
    task: TaskType,
}

const Task = ({ task }: Props) => {
    const { deleteTask } = useTasks();
    const [{ opacity }, dragRef] = useDrag(() => ({
        type: 'TASK',
        item: { id: task.id },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0 : 1,
        }),
    }), [task.id]);

    return (
        <Resizable height={10}
            width={200}
            resizeHandles={['s']}
            handle={<span className="react-resizable-handle react-resizable-handle-s" />}
            onResize={(e) => console.log(e)}>
            <div className={Styles['task']} ref={dragRef} style={{ opacity }}>
                <div className={Styles['label']}>
                    {task.name}
                </div>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
        </Resizable>
    )
};

export default Task;