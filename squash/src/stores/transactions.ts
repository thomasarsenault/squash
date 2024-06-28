// store/tasks.js
import { defineStore } from 'pinia';
import type { Task, GroupedTasks } from '@/types';
import dayjs from 'dayjs';
import Stan from '../utils/stan';

const apiUrl = import.meta.env.STAN_API_URL || '';

const getHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Authorization': `Bearer ${token}`
    }
}

const MOCK_EXPENSES = [
    {
        id: 1,
        name: 'LCBO',
        amount: 52.65,
        date: '2024-06-12',
        category: 'Food & Drink',
        subcategory: 'Liquor',
    },
    {
        id: 2,
        name: 'Metro',
        amount: 32.65,
        date: '2024-06-12',
        category: 'Food & Drink',
        subcategory: 'Groceries',
    },
    {
        id: 3,
        name: 'Amazon',
        amount: 12.65,
        date: '2024-06-12',
        category: 'Shopping',
        subcategory: 'Online',
    },
    {
        id: 4,
        name: 'Starbucks',
        amount: 4.95,
        date: '2024-06-11',
        category: 'Food & Drink',
        subcategory: 'Coffee',
    },
    {
        id: 5,
        name: 'Shell',
        amount: 45.00,
        date: '2024-06-11',
        category: 'Transportation',
        subcategory: 'Gas',
    },
    {
        id: 6,
        name: 'Walmart',
        amount: 75.34,
        date: '2024-06-10',
        category: 'Shopping',
        subcategory: 'Retail',
    },
    {
        id: 7,
        name: 'Netflix',
        amount: 15.99,
        date: '2024-06-09',
        category: 'Entertainment',
        subcategory: 'Subscription',
    },
    {
        id: 8,
        name: 'Uber',
        amount: 23.50,
        date: '2024-06-09',
        category: 'Transportation',
        subcategory: 'Ride-sharing',
    },
    {
        id: 9,
        name: 'Whole Foods',
        amount: 120.67,
        date: '2024-06-08',
        category: 'Food & Drink',
        subcategory: 'Groceries',
    },
    {
        id: 10,
        name: 'Spotify',
        amount: 9.99,
        date: '2024-06-07',
        category: 'Entertainment',
        subcategory: 'Subscription',
    },
    {
        id: 11,
        name: 'Apple Store',
        amount: 299.99,
        date: '2024-06-06',
        category: 'Shopping',
        subcategory: 'Electronics',
    },
    {
        id: 12,
        name: 'McDonald\'s',
        amount: 8.79,
        date: '2024-06-05',
        category: 'Food & Drink',
        subcategory: 'Fast Food',
    },
    {
        id: 13,
        name: 'Target',
        amount: 54.23,
        date: '2024-06-04',
        category: 'Shopping',
        subcategory: 'Retail',
    },
    {
        id: 14,
        name: 'Costco',
        amount: 250.00,
        date: '2024-06-03',
        category: 'Food & Drink',
        subcategory: 'Groceries',
    },
    {
        id: 15,
        name: 'Best Buy',
        amount: 99.99,
        date: '2024-06-02',
        category: 'Shopping',
        subcategory: 'Electronics',
    },
    {
        id: 16,
        name: 'Home Depot',
        amount: 45.67,
        date: '2024-06-01',
        category: 'Home Improvement',
        subcategory: 'Supplies',
    },
    {
        id: 17,
        name: 'Sephora',
        amount: 32.89,
        date: '2024-05-31',
        category: 'Shopping',
        subcategory: 'Beauty',
    },
    {
        id: 18,
        name: 'Uber Eats',
        amount: 25.34,
        date: '2024-05-30',
        category: 'Food & Drink',
        subcategory: 'Delivery',
    },
    {
        id: 19,
        name: 'Lyft',
        amount: 18.75,
        date: '2024-05-29',
        category: 'Transportation',
        subcategory: 'Ride-sharing',
    },
    {
        id: 20,
        name: 'CVS',
        amount: 14.55,
        date: '2024-05-28',
        category: 'Health',
        subcategory: 'Pharmacy',
    },
    {
        id: 21,
        name: 'Amazon',
        amount: 99.99,
        date: '2024-05-27',
        category: 'Shopping',
        subcategory: 'Online',
    },
    {
        id: 22,
        name: 'Trader Joe\'s',
        amount: 65.45,
        date: '2024-05-26',
        category: 'Food & Drink',
        subcategory: 'Groceries',
    },
    {
        id: 23,
        name: 'Apple Music',
        amount: 9.99,
        date: '2024-05-25',
        category: 'Entertainment',
        subcategory: 'Subscription',
    },
    {
        id: 24,
        name: 'Walgreens',
        amount: 25.67,
        date: '2024-05-24',
        category: 'Health',
        subcategory: 'Pharmacy',
    },
    {
        id: 25,
        name: 'Disney+',
        amount: 7.99,
        date: '2024-05-23',
        category: 'Entertainment',
        subcategory: 'Subscription',
    },
    {
        id: 26,
        name: 'Dollar Tree',
        amount: 12.34,
        date: '2024-05-22',
        category: 'Shopping',
        subcategory: 'Retail',
    },
    {
        id: 27,
        name: 'Ikea',
        amount: 123.45,
        date: '2024-05-21',
        category: 'Home Improvement',
        subcategory: 'Furniture',
    },
    {
        id: 28,
        name: 'Chick-fil-A',
        amount: 7.89,
        date: '2024-05-20',
        category: 'Food & Drink',
        subcategory: 'Fast Food',
    },
    {
        id: 29,
        name: 'Hulu',
        amount: 5.99,
        date: '2024-05-19',
        category: 'Entertainment',
        subcategory: 'Subscription',
    },
    {
        id: 30,
        name: 'Gym Membership',
        amount: 45.00,
        date: '2024-05-18',
        category: 'Health',
        subcategory: 'Fitness',
    },
    {
        id: 31,
        name: 'Trader Joe\'s',
        amount: 58.75,
        date: '2024-05-17',
        category: 'Food & Drink',
        subcategory: 'Groceries',
    },
    {
        id: 32,
        name: 'Panera Bread',
        amount: 12.89,
        date: '2024-05-16',
        category: 'Food & Drink',
        subcategory: 'Restaurant',
    }
];

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        addModalOpen: false,
    }),
    actions: {
        async getTransactions() {
            try {
                const start = dayjs().day(1).format('YYYY-MM-DD');
                const end = dayjs().day(7).format('YYYY-MM-DD');

                const data = await Stan(`transactions?start=${start}&end=${end}`);

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
    },
});
