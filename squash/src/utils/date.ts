import dayjs from 'dayjs';
import { AgendaZones } from '../utils/constants';

export const getDateByZone = (zone: AgendaZones): string => {
    let now = dayjs();
    switch (zone) {
        case AgendaZones.TODAY:
            // now = now;
            break;
        case AgendaZones.TOMORROW:
            now = now.add(1, 'day');
            break;
        case AgendaZones.THIS_WEEK:
            now = now.add(7, 'day');
            break;
        default:
            // return now;
    }

    return now.format('YYYY-MM-DD')
}