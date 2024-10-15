<script setup lang="ts">
import dayjs from 'dayjs';
import { useTransactionStore } from '@/stores/transactions';
import { onMounted, ref, computed } from 'vue';
import AddTransaction from '@/components/Finances/AddTransaction.vue';
import EditTransaction from '@/components/Finances/EditTransaction.vue';
import TransactionHistory from '@/components/Finances/TransactionHistory.vue';
import { formatAmount } from '@/utils/helper';

const store = useTransactionStore();
const MONTHS = Array.from({ length: 12 }, (_, i) => ({ label: dayjs().month(i).format('MMMM'), value: i }));
onMounted(async () => {
  store.getTransactions().then(() => {
    console.log('tasks', store.tasks);
  })
})

const startOfWeek = dayjs().startOf('week').add(1, 'day');
const showFilters = ref(false);

const selectedMonth = ref(MONTHS[dayjs().month()]);

const pendingTransactions = computed(() => {
  return store.transactions.filter(transaction => transaction.pending);
});

const transactions = computed(() => {
  return store.transactions.filter(transaction => !transaction.pending);
});

const selectedTransactions = computed(() => {
  return transactions.value.filter(transaction => {
    return dayjs(transaction.date).month() === selectedMonth.value.value;
  }) || [];
});

const totalAmountThisMonth = computed(() => {
  return formatAmount(selectedTransactions.value.reduce((acc, transaction) => acc + transaction.amount, 0));
});

const totalAmountThisWeek = computed(() => {
  const transactionsThisWeek = transactions.value.filter(transaction => {
    return dayjs(transaction.date).isAfter(startOfWeek.subtract(1, 'day'));
  });

  return {
    amount: formatAmount(transactionsThisWeek.reduce((acc, transaction) => acc + transaction.amount, 0)),
    count: transactionsThisWeek.length
  }
});

const totalAmountLastWeek = computed(() => {
  const transactionsLastWeek = transactions.value.filter(transaction => {
    return dayjs(transaction.date).isAfter(startOfWeek.subtract(1, 'week').subtract(1, 'day')) && dayjs(transaction.date).isBefore(startOfWeek.add(1, 'day'));
  });

  return {
    amount: formatAmount(transactionsLastWeek.reduce((acc, transaction) => acc + transaction.amount, 0)),
    count: transactionsLastWeek.length
  }
});

const openEditModal = (transaction) => {
  store.editModal.transaction = transaction;
  store.editModal.open = true;
}

const items = ref([
  {
    label: 'Transactions',
    icon: 'pi pi-fw pi-money-bill',
    to: '/expenses'
  },
  {
    label: 'Budget',
    icon: 'pi pi-fw pi-chart-bar',
    to: '/expenses/budget'
  }
])

</script>

<template>
  <SubMenu :items="items"/>
  <main>
    <div class="action-bar">
      <Button label="Add Transaction" @click="() => store.addModalOpen = true"/>
      <Select v-model="selectedMonth"
          :options="Array.from({ length: 12 }, (_, i) => ({ label: dayjs().month(i).format('MMMM'), value: i }))"
          optionLabel="label"/>
    </div>
    <div class="expenses">
      <div class="top">
        <div class="statistics">
          <Card>
            <template #title>📊 Statistics</template>
            <template #content>
              <div class="stats">
                <div v-if="selectedMonth.value === dayjs().month()" class="section">
                  <!-- <div class="title">This Week</div> -->
                  <div class="stat-group">
                    <div class="stat">
                      <div class="label">Spent this week</div>
                      <div class="value">{{ totalAmountThisWeek.amount }}</div>
                    </div>
                    <div class="stat">
                      <div class="label">Transactions</div>
                      <div class="value">{{ totalAmountThisWeek.count }}</div>
                    </div>
                  </div>
                </div>
                <div v-if="selectedMonth.value === dayjs().month()" class="section">
                  <!-- <div class="title">This Week</div> -->
                  <div class="stat-group">
                    <div class="stat">
                      <div class="label">Spent last week</div>
                      <div class="value">{{ totalAmountLastWeek.amount }}</div>
                    </div>
                    <div class="stat">
                      <div class="label">Transactions</div>
                      <div class="value">{{ totalAmountLastWeek.count }}</div>
                    </div>
                  </div>
                </div>
                <div class="section">
                  <!-- <div class="title">This Month</div> -->
                  <div class="stat-group">
                    <div class="stat">
                      <div class="label">Spent this month</div>
                      <div class="value">{{ totalAmountThisMonth }}</div>
                    </div>
                    <div class="stat">
                      <div class="label">Transactions</div>
                      <div class="value">{{ selectedTransactions.length }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="transactions">
        <Card class="table">
            <template #title>
              <div class="title">
                💸 Transaction History
                <Button @click="showFilters = !showFilters" severity="secondary" icon="pi pi-filter"/>
              </div>
            </template>
            <template #content>
              <TransactionHistory :transactions="selectedTransactions" :showFilters="showFilters" @rowSelect="(e) => openEditModal(e)"/>
            </template>
        </Card>
      </div>
      <div class="pending">
        <Card>
          <template #title>🕒 Pending Transactions</template>
          <template #content>
            <TransactionHistory :transactions="pendingTransactions" :showFilters="false" @rowSelect="(e) => openEditModal(e)"/>
          </template>
        </Card>
      </div>
    </div>
    <AddTransaction id="add-transaction-dialog"/>
    <EditTransaction id="edit-transaction-dialog"/>
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

// .p-menubar {
//   padding: 0;
//   background: none;
//   border: none;
// }

// :deep(.p-tablist-tab-list) {
//   background: none;
//   border: none;

//   button {
//     font-size: 1rem;
//   }
// }
.action-bar {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
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
    }
  }
}

.stats {
  display: flex;
  gap: 5rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  @include breakpoint('mobile') {
    gap: 2rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    @include breakpoint('mobile') {
      width: 100%;
    }

    .title {
      font-size: 1rem;
    }

    .stat-group {
      display: flex;
      gap: 3rem;

      @include breakpoint('mobile') {
        justify-content: space-between;
      }

      .stat {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        @include breakpoint('mobile') {
          align-items: center;
        }

        .label {
          font-size: 0.75rem;
          color: var(--p-text-muted-color);
        }

        .value {
          font-size: 1.2rem;
          font-weight: bold;
        }
      }
    }
  }
}

.title {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>