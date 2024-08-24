// store/tasks.js
import { defineStore } from 'pinia';
import type { Task, GroupedTasks } from '@/types';
import dayjs from 'dayjs';
import Stan from '../utils/stan';

const CATEGORIES = [
    {
        name: 'Food & Drink',
        displayName: '🥗 Food & Drink',
        subcategories: [
            'Groceries',
            'Alcohol',
            'Work lunch',
            'Eating out',
            'Candy',
        ]
    },
    {
        name: 'Entertainment',
        displayName: '📺 Entertainment',
        subcategories: [
            'Nights out',
            'Media',
            'Games',
            'Electronics'
        ]
    },
    {
        name: 'Travel',
        displayName: '✈️ Travel',
        subcategories: [
            'Vacation',
            'Cottage'
        ]
    },
    {
        name: 'Housing',
        displayName: '🏠 Housing',
        subcategories: [
            'Rent',
            'Utilities',
            'Home improvement'
        ]
    },
    {
        name: 'Personal development',
        displayName: '🧠 Personal development',
        subcategories: [
            'Education',
            'Tools'
        ]
    },
    {
        name: 'Transportation',
        displayName: '🚗 Transportation',
        subcategories: [
            'Presto',
            'Uber',
            'Gas'
        ]
    },
    {
        name: 'Other',
        displayName: '🪣 Other',
        subcategories: [
            'Other',
        ]
    }
]
export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        categories: CATEGORIES,
        addModalOpen: false,
        editModal: {
            open: false,
            transaction: {}
        }
    }),
    actions: {
        async getTransactions() {
            try {
                const start = dayjs().day(1).format('YYYY-MM-DD');
                const end = dayjs().day(7).format('YYYY-MM-DD');

                const data = await Stan(`transactions?start=${start}&end=${end}`);

                if(data.error) {
                    throw data.error;
                }

                this.transactions = data;
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        },
        async addTransaction(newTransaction: any) {
            try {
                console.log(newTransaction);
                const response = await Stan(`transactions`, {
                    method: 'POST',
                    body: JSON.stringify({
                        transaction: newTransaction
                    })
                });

                (this.transactions as any).push(newTransaction);

                return response;
            } catch (error) {
                console.error('Error adding transaction:', error);
            }
        },
        async updateTransaction(transaction: any) {
            try {
                const response = await Stan(`transactions`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        transaction
                    })
                });

                const index = (this.transactions as any).findIndex((t: Task) => t.id === transaction.id);
                (this.transactions as any)[index] = transaction;

                return response;
            } catch (error) {
                console.error('Error editing transaction:', error);
            }
        },
        async deleteTransaction(transaction: any) {
            try {
                const response = await Stan(`/transactions?id=${transaction.id}`, {
                    method: 'DELETE',
                });

                const index = (this.transactions as any).findIndex((t: Task) => t.id === transaction.id);
                (this.transactions as any).splice(index, 1);

                return response;
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    },
    getters: {
        dropdownCategories: (state) => {
            return state.categories.map((category) => {
                return {
                    label: category.displayName,
                    value: category.name,
                    items: category.subcategories.map((subcategory) => {
                        return {
                            label: subcategory,
                            value: subcategory,
                            parentCategory: category.name
                        }
                    })
                }
            });
        }
    }
});
