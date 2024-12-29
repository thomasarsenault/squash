import db from "@db/supabase.manager";
import dayjs from 'dayjs';

//moves all incompleted tasks from the previous day to today, adds them to the end of the ranks
const migrateTasks = async () => {
    const today = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const tomorrow = dayjs().format('YYYY-MM-DD');

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
    let taskRanksToday = taskRanks.find((taskRank) => taskRank.date === today)?.ranks || [];
    const taskRanksTomorrow = taskRanks.find((taskRank) => taskRank.date === tomorrow)?.ranks || [];

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

// temporary fix to make up for some bad design choices many months ago 
// FE calculates (today + 1 week) as the date for what 'This Week' tasks to show
// i now want to use that section as a persistent backlog
// so until i refactor all of this nonsense im just gonna put those tasks back to (today + 1 week) so theyll show on the FE indefinitely
const moveBacklogBack = async () => {
    const movedBacklogDate = dayjs().add(1, 'week').subtract(1, 'day').format('YYYY-MM-DD');
    const correctBacklogDate = dayjs().add(1, 'week').format('YYYY-MM-DD');

    const { data, error } = await db.from('tasks').select('*').eq('date', movedBacklogDate);

    if (error) {
        throw error;
    }

    if(!data || data.length === 0) {
        return;
    }

    const { data: taskRanks, error: taskRanksError } = await db.from('task_ranks').select('*').eq('date', movedBacklogDate);

    if(taskRanksError) {
        throw taskRanksError;
    }

    data.forEach(async (task) => {
        console.log('in loop', task.id)

        const updatedTask = {
            ...task,
            date: correctBacklogDate
        }

        const { data: taskData, error: taskError } = await db.from('tasks').update(updatedTask).eq('id', task.id);

        if(taskError) {
            throw taskError;
        }
    });

    const taskRank = taskRanks[0];

    const { data: taskRankData, error: taskRankError } = await db.from('task_ranks').upsert({ ranks: taskRank.ranks, date: correctBacklogDate}, { onConflict: 'date'}).eq('date', correctBacklogDate).select();
    await db.from('task_ranks').update({ ranks: [] }).eq('date', movedBacklogDate);

    if(taskRankError) {
        throw taskRankError;
    }

}
export {
    migrateTasks,
    moveBacklogBack
}