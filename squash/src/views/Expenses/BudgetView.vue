<script setup lang="ts">
import dayjs from 'dayjs';
import { useTransactionStore } from '@/stores/transactions';
import { onMounted, ref, computed } from 'vue';
import AddExpense from '@/components/Expenses/AddExpense.vue';
import EditExpense from '@/components/Expenses/EditExpense.vue';
import TransactionHistory from '@/components/Expenses/TransactionHistory.vue';
import { formatAmount } from '@/utils/helper';
import SubMenu from '../../components/SubMenu.vue';

const store = useTransactionStore();

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
  <!-- <SubMenu :items="items"/> -->
  <main>
    <div class="action-bar">
      <Button label="Add Expense" @click="() => store.addModalOpen = true"/>
    </div>
    <div class="expenses">
      <Card>
        <template #title>Test</template>
        <template #content>
          <Select v-model="selectedMonth"
            :options="Array.from({ length: 12 }, (_, i) => ({ label: dayjs().month(i).format('MMMM'), value: i }))"
            optionLabel="label"/>
        </template>
      </Card>
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

.p-menubar {
  padding: 0;
  background: none;
  
  // :deep(.p-menubar-item-link), :deep(.p-menubar-item-icon) {
  //   color: var(--p-primary-color);
  // }
}

.tab-link {
  color: var(--p-text-primary-color);
  text-decoration: none;
  font-size: 1rem;
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
        gap: 3rem;

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
</style>