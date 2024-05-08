import db from "@db/supabase.manager";
import dayjs from 'dayjs';

//moves all incompleted tasks from the previous day to today, adds them to the end of the ranks
const migrateTasks = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

    const { data, error } = await db.from('tasks').select('*').eq('date', today);

    if (error) {
        throw error;
    }

    if(!data || data.length === 0) {
        return;
    }

    //get task_ranks
    const { data: taskRanks, error: taskRanksError } = await db.from('task_ranks').select('*').or(`date.eq.${today},date.eq.${tomorrow}`);

    if(taskRanksError) {
        throw taskRanksError;
    }


    console.log('taskRanks', taskRanks);
    let taskRanksToday = taskRanks.find((taskRank) => taskRank.date === today).ranks;
    const taskRanksTomorrow = taskRanks.find((taskRank) => taskRank.date === tomorrow).ranks;

    data.forEach(async (task) => {
        console.log('in loop', task.id, task.completed)
        if(task.completed) {
            return;
        }
        console.log('not skipped')

        const updatedTask = {
            ...task,
            date: dayjs(task.date).add(1, 'day').format('YYYY-MM-DD')
        }

        taskRanksToday = taskRanksToday.filter((rank: number) => rank !== task.id);
        console.log(taskRanksToday);
        taskRanksTomorrow.push(task.id);

        console.log(updatedTask);
        const { data: taskData, error: taskError } = await db.from('tasks').update(updatedTask).eq('id', task.id);
        const { data: taskRanksData, error: taskRanksError } = await db.from('task_ranks').upsert({ ranks: taskRanksToday, date: today}, { onConflict: 'date'}).eq('date', today).select();
        const { data: taskRanksDataTomorrow, error: taskRanksErrorTomorrow } = await db.from('task_ranks').upsert({ ranks: taskRanksTomorrow, date: tomorrow}, { onConflict: 'date'}).eq('date', tomorrow).select();

        if(taskError) {
            throw taskError;
        }

        console.log('taskData', taskData);
    });


}

export {
    migrateTasks
}