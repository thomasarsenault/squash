import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import Stan from '../utils/stan';

export const useExpensesStore = defineStore('expenses', {
    state: () => ({
        expenses: [],
        addModalOpen: false,
        editModal: {
            open: false,
            expense: {}
        }
    }),
    actions: {
        async getExpenses() {
            try {
                const data = await Stan(`expenses`);

                if(data.error) {
                    throw data.error;
                }

                this.expenses = data;
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        },
        async addExpense(newExpense: any) {
            try {
                console.log(newExpense);
                const response = await Stan(`expenses`, {
                    method: 'POST',
                    body: JSON.stringify({
                        expense: newExpense
                    })
                });

                (this.expenses as any).push(response);

                return response;
            } catch (error) {
                console.error('Error adding transaction:', error);
            }
        },
        async updateExpense(expense: any) {
            try {
                const response = await Stan(`expenses`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        expense
                    })
                });

                const index = (this.expenses as any).findIndex((t: any) => t.id === expense.id);
                (this.expenses as any)[index] = expense;

                return response;
            } catch (error) {
                console.error('Error editing transaction:', error);
            }
        },
        async deleteExpense(transaction: any) {
            try {
                const response = await Stan(`/expenses?id=${transaction.id}`, {
                    method: 'DELETE',
                });

                const index = (this.expenses as any).findIndex((t: any) => t.id === transaction.id);
                (this.expenses as any).splice(index, 1);

                return response;
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    }
});
