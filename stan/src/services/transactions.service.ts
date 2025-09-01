import { Task, TaskInput, TaskRanks, TaskRanksDB } from "@types";
import db from "@db/supabase.manager";

interface TaskQueryParams {
	start: string | null;
	end: string | null;
}

const getTransactions = async (params: TaskQueryParams): Promise<Task[]> => {
	
	// const { data, error } = await db.from('transactions').select('*').gte('date', params.start).lte('date', params.end);
	const { data, error } = await db.from('transactions').select('*');
	
	if(error) {
		throw error;
	}

	return data;
}

const createTransaction = async (newTransaction: any): Promise<Task> => {
	console.log('creating a transaction')
	console.log(newTransaction);

	const { data, error } = await db.from('transactions').insert(newTransaction).select();

	if (error) {
		throw error;
	}

	return data[0];
}

const deleteTransaction = async (transactionId: string): Promise<number> => {
	console.log('deleting transaction')
	let { error } = await db.from('transactions').delete().eq('id', transactionId);

	if(error) {
		throw error;
	}

	return Promise.resolve(Number(transactionId));
}

const updateTransaction = async (updatedTransaction: any): Promise<Task> => { 
	console.log('updating transaction')
	console.log(updatedTransaction);

	const { data, error } = await db.from('transactions').update(updatedTransaction).eq('id', updatedTransaction.id).select();

	if (error) {
		throw error;
	}

	return data[0];
 };

const getExpenses = async (): Promise<Task[]> => {
	
	const { data, error } = await db.from('expenses').select('*');
	
	if(error) {
		throw error;
	}

	return data;
}

const createExpense = async (newExpense: any): Promise<Task> => {
	console.log('creating an expense')
	console.log(newExpense);

	const { data, error } = await db.from('expenses').insert(newExpense).select();

	if (error) {
		throw error;
	}

	return data[0];
}

const deleteExpense = async (expenseId: string): Promise<number> => {
	console.log('deleting expense')
	let { error } = await db.from('expenses').delete().eq('id', expenseId);

	if(error) {
		throw error;
	}

	return Promise.resolve(Number(expenseId));
}

const updateExpense = async (updatedExpense: any): Promise<Task> => { 
	console.log('updating expense')
	console.log(updatedExpense);

	const { data, error } = await db.from('expenses').update(updatedExpense).eq('id', updatedExpense.id).select();

	if (error) {
		throw error;
	}

	return data[0];
 };

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