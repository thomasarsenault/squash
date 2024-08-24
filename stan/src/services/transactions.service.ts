import { Task, TaskInput, TaskRanks, TaskRanksDB } from "@types";
import db from "@db/supabase.manager";

interface TaskQueryParams {
	start: string | null;
	end: string | null;
}

const getTransactions = async (params: TaskQueryParams): Promise<Task[]> => {
	
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

export default {
	getTransactions,
	createTransaction,
	deleteTransaction,
	updateTransaction
};