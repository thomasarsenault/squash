// store/tasks.js
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import Stan from '../utils/stan';
import CATEGORIES from '@/data/transactionCategories';
import type { Transaction, CategoryDropdownItem } from '@/types';

interface State {
  transactions: Transaction[];
  categories: typeof CATEGORIES;
  addModalOpen: boolean;
  editModal: {
    open: boolean;
    transaction: Partial<Transaction>;
  };
}
export const useTransactionStore = defineStore('transactions', {
  state: (): State => ({
    transactions: [],
    categories: CATEGORIES,
    addModalOpen: false,
    editModal: {
      open: false,
      transaction: {},
    },
  }),
  actions: {
    async getTransactions() {
      try {
        const start = dayjs().day(1).format('YYYY-MM-DD');
        const end = dayjs().day(7).format('YYYY-MM-DD');

        const data = await Stan(`transactions?start=${start}&end=${end}`);

        if (data.error) {
          throw data.error;
        }

        this.transactions = data.sort((a: any, b: any) => {
          return dayjs(b.date).unix() - dayjs(a.date).unix();
        });
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
            transaction: newTransaction,
          }),
        });

        (this.transactions as any).push(response);

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
            transaction,
          }),
        });

        const index = (this.transactions as any).findIndex((t: any) => t.id === transaction.id);
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

        const index = (this.transactions as any).findIndex((t: any) => t.id === transaction.id);
        (this.transactions as any).splice(index, 1);

        return response;
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    },
  },
  getters: {
    dropdownCategories: (state): CategoryDropdownItem[] => {
      return state.categories.map((category) => {
        return {
          label: category.displayName,
          value: category.name,
          items: category.subcategories.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
              parentCategory: category.name,
            };
          }),
        };
      });
    },
  },
});
