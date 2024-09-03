<script setup lang="ts">
import dayjs from 'dayjs';
import { useTransactionStore } from '@/stores/transactions';
import { onMounted, ref, computed } from 'vue';
import AddExpense from '@/components/Expenses/AddExpense.vue';
import EditExpense from '@/components/Expenses/EditExpense.vue';
import TransactionHistory from '@/components/Expenses/TransactionHistory.vue';
import { formatAmount } from '@/utils/helper';

const store = useTransactionStore();
const MONTHS = Array.from({ length: 12 }, (_, i) => ({ label: dayjs().month(i).format('MMMM'), value: i }));
onMounted(async () => {
  store.getTransactions().then(() => {
    console.log('tasks', store.tasks);
  })
})

const showFilters = ref(false);

const selectedMonth = ref(MONTHS[dayjs().month()]);
const selectedTransactions = computed(() => {
  return store.transactions.filter(transaction => {
    return dayjs(transaction.date).month() === selectedMonth.value.value;
  }) || [];
});

const totalAmountThisMonth = computed(() => {
  return formatAmount(selectedTransactions.value.reduce((acc, transaction) => acc + transaction.amount, 0));
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
  <main>
    <!-- <Menubar :model="items" /> -->
    <!-- <Tabs value="/expenses">
      <TabList>
        <Tab :value="'/expenses'">
          <RouterLink v-slot="{ href,  navigate }" to="/expenses" custom>
            <a class="tab-link" @click="navigate" :href="href">Transactions</a>
          </RouterLink>
        </Tab>
        <Tab :value="'/expenses/budget'">
          <RouterLink v-slot="{ href,  navigate }" to="/expenses/budget" custom>
            <a class="tab-link" @click="navigate" :href="href">Budget</a>
          </RouterLink>
        </Tab>
      </TabList>
    </Tabs> -->
    <!-- <Tabs :value="0">
      <TabList>
        <Tab :value="0">
            Transactions
        </Tab>
        <Tab :value="1">Budget</Tab>
      </TabList>
    </Tabs> -->
    <div class="action-bar">
      <Button label="Add Transaction" @click="() => store.addModalOpen = true"/>
    </div>
    <div class="expenses">
      <Card>
        <template #title>Month</template>
        <template #content>
          <Select v-model="selectedMonth"
            :options="Array.from({ length: 12 }, (_, i) => ({ label: dayjs().month(i).format('MMMM'), value: i }))"
            optionLabel="label"/>
        </template>
      </Card>
      <div class="top">
        <div class="statistics">
          <Card>
            <template #title>📊 Statistics</template>
            <template #content>
              <div class="stats">
                <div class="stat">
                  <div class="label">Spent</div>
                  <div class="value">{{ totalAmountThisMonth }}</div>
                </div>
                <div class="stat">
                  <div class="label">Transactions</div>
                  <div class="value">{{ selectedTransactions.length }}</div>
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
    </div>
    <AddExpense id="add-transaction-dialog"/>
    <EditExpense id="edit-transaction-dialog"/>
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
        gap: 3rem;
        margin-top: 1rem;

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

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
}

.title {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>