import cron from 'node-cron';
import { migrateTasks, moveBacklogBack } from './tasks';

const scheduler = () => {
    cron.schedule('0 4 * * *', () => { // nightly at 4am
        migrateTasks();
        moveBacklogBack();
    })
}

export default scheduler;