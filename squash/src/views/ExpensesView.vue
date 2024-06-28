<script setup lang="ts">
import dayjs from 'dayjs';
import { useTasksStore } from '../stores/tasks';
import { useTransactionStore } from '../stores/transactions';
import { onMounted, ref, computed } from 'vue';
import AddExpense from '../components/Expenses/AddExpense.vue';
import TransactionHistory from '../components/Expenses/TransactionHistory.vue';

const store = useTransactionStore();

onMounted(async () => {
  store.getTransactions().then(() => {
    console.log('tasks', store.tasks);
  })
})

const totalAmountThisMonth = computed(() => {
  return store.transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
});
const totalTransactionsThisMonth = computed(() => {
  return store.transactions.filter(transaction => {
    return dayjs(transaction.date).isSame(dayjs(), 'month');
  }).length;
});

</script>

<template>
  <main>
    <div class="action-bar">
      <Button label="Add Transactions" @click="() => store.addModalOpen = true"/>
    </div>
    <div class="expenses">
      <div class="top">
        <div class="statistics">
          <Card>
            <template #title>📊 Statistics</template>
            <template #content>
              <div class="stats">
                <div class="stat">
                  <div class="label">Total {{ dayjs().format('MMMM') }} Expenses</div>
                  <div class="value">{{ `$${totalAmountThisMonth.toFixed(2)}` }}</div>
                </div>
                <div class="stat">
                  <div class="label">Total {{ dayjs().format('MMMM') }} Transactions</div>
                  <div class="value">{{  totalTransactionsThisMonth }}</div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="transactions">
        <Card class="table">
            <template #title>💸 Transaction History</template>
            <template #content>
              <TransactionHistory :transactions="store.transactions" />
            </template>
        </Card>
      </div>
    </div>
    <AddExpense id="add-transaction-dialog"/>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.expenses {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .top {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .statistics {
      flex: 1 1 auto;
      .p-card {
        height: 100%;
      }

      .stats {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .stat {
          display: flex;
          gap: 1rem;
        }
      }
    }
  }
}
</style>