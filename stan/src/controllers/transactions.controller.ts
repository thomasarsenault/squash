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
    const { id } = Object.fromEntries(url.searchParams.entries());

    const res = await transactionsService.deleteTransaction(id);

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

const getExpenses = async (req: Request) => {
    const expenses: any[] = await transactionsService.getExpenses();

    return new ClientResponse(JSON.stringify(expenses), { status: 200 });
}

const createExpense = async (req: Request) => {
    const data: any = await req.json();
    const expense: Task = await transactionsService.createExpense(data.expense);

    return new ClientResponse(JSON.stringify(expense), { status: 200 });
}

const deleteExpense = async (req: Request) => {
    const url = new URL(req.url);
    const { id } = Object.fromEntries(url.searchParams.entries());

    const res = await transactionsService.deleteExpense(id);

    if(!res) {
        return new ClientResponse(null, { status: 404 });
    }

    return new ClientResponse(JSON.stringify({ id: res }), { status: 200 });
}

const updateExpense = async (req: Request) => {
    const data: any = await req.json();
    const expense: Task = await transactionsService.updateExpense(data.expense);

    return new ClientResponse(JSON.stringify(expense), { status: 200 });
}

export default {
    getTransactions,
    createTransaction,
    deleteTransaction,
    updateTransaction,
    getExpenses,
    createExpense,
    deleteExpense,
    updateExpense
};