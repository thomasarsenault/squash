<script setup lang="ts">
import { useExpensesStore } from '@/stores/expenses';
import { onMounted, ref, computed } from 'vue';
import AddExpense from '@/components/Finances/Expenses/AddExpense.vue';
import EditExpense from '@/components/Finances/Expenses/EditExpense.vue';
import SubMenu from '@/components/SubMenu.vue';
import ExpensesList from '@/components/Finances/Expenses/ExpensesList.vue';
import { formatAmount } from '@/utils/helper';

const store = useExpensesStore();

onMounted(async () => {
  store.getExpenses().then(() => {
    console.log('expenses', store.expenses);
  });
});

const openEditModal = (expense) => {
  console.log('hello');
  store.editModal.expense = expense;
  store.editModal.open = true;
};

const items = ref([
  {
    label: 'Transactions',
    icon: 'pi pi-fw pi-money-bill',
    to: '/expenses',
  },
  {
    label: 'Budget',
    icon: 'pi pi-fw pi-chart-bar',
    to: '/expenses/budget',
  },
]);

const total = computed(() => {
  return formatAmount(store.expenses.reduce((acc, expense) => acc + expense.amount, 0));
});
</script>

<template>
  <SubMenu :items="items" />
  <main>
    <div class="action-bar">
      <Button label="Add Expense" @click="() => (store.addModalOpen = true)" />
    </div>
    <div class="expenses">
      <Card>
        <template #title>Total</template>
        <template #content>
          {{ total }}
        </template>
      </Card>
      <Card>
        <template #content>
          <ExpensesList :expenses="store.expenses" @rowSelect="(e) => openEditModal(e)" />
        </template>
      </Card>
      <!-- <Card>
        <template #title>Test</template>
        <template #content>
          <Select v-model="selectedMonth"
            :options="Array.from({ length: 12 }, (_, i) => ({ label: dayjs().month(i).format('MMMM'), value: i }))"
            optionLabel="label"/>
        </template>
      </Card> -->
    </div>
    <AddExpense id="add-expense-dialog" />
    <EditExpense id="edit-expense-dialog" />
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
