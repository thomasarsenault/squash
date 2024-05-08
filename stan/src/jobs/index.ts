import cron from 'node-cron';
import { migrateTasks } from './tasks';

const scheduler = () => {
    cron.schedule('0 4 * * *', () => {
        migrateTasks();
    })
}

export default scheduler;