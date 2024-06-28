import ClientResponse from '@middleware/clientResponse';
import transactionsService from '@services/transactions.service';
import { Task, TaskRanks, TaskRanksDB } from '@types';
import dayjs from 'dayjs';

const getTransactions = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const transactions: any[] = await transactionsService.getTransactions({ start, end});

    return new ClientResponse(JSON.stringify(transactions), { status: 200 });
}

const createTransaction = async (req: Request) => {
    const data: any = await req.json();
    const transaction: Task = await transactionsService.createTransaction(data.transaction);

    return new ClientResponse(JSON.stringify(transaction), { status: 200 });
}

const deleteTransaction = async (req: Request) => {
    const url = new URL(req.url);
    const { id, date } = Object.fromEntries(url.searchParams.entries());

    const res = await transactionsService.deleteTransaction(id, date);

    if(!res) {
        return new ClientResponse(null, { status: 404 });
    }

    return new ClientResponse(JSON.stringify({ id: res }), { status: 200 });
}

const updateTransaction = async (req: Request) => {
    const data: any = await req.json();
    const transaction: Task = await transactionsService.updateTransaction(data.transaction);

    return new ClientResponse(JSON.stringify(transaction), { status: 200 });
}

export default {
    getTransactions,
    createTransaction,
    deleteTransaction,
    updateTransaction
};