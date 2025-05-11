import cron from 'node-cron';
import { migrateTasks, moveBacklogBack } from './tasks';

const scheduler = () => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Skipping scheduled jobs in development environment');
        return;
    }

    cron.schedule('0 4 * * *', () => { // nightly at 4am
        migrateTasks();
        moveBacklogBack();
    })
}

export default scheduler;