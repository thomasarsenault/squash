<script setup lang="ts">
import { useExpensesStore } from '@/stores/expenses';
import { useTransactionStore } from '@/stores/transactions';
import { onMounted, ref, computed } from 'vue';
import AddExpense from '@/components/Finances/Expenses/AddExpense.vue';
import EditExpense from '@/components/Finances/Expenses/EditExpense.vue';
import BudgetList from '@/components/Finances/BudgetList.vue';
import CategoryMeterGroups from '@/components/Finances/CategoryMeterGroups.vue';
import SubMenu from '@/components/SubMenu.vue';
import { formatAmount } from '@/utils/helper';

const store = useExpensesStore();
const transactionStore = useTransactionStore();

onMounted(async () => {
  store.getExpenses().then(() => {
    console.log('expenses', store.expenses);
  });
});

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

const openEditModal = (expense: any) => {
  store.editModal.expense = expense;
  store.editModal.open = true;
};

const summary = computed(() => {
  const totalAmount = store.expenses.reduce((acc: number, expense: any) => acc + expense.amount, 0);
  return {
    totalAmount: totalAmount,
    totalAmountFormatted: formatAmount(totalAmount),
    count: store.expenses.length,
  };
});
</script>

<template>
  <SubMenu :items="items" />
  <main>
    <div class="budget">
      <div class="top">
        <Card class="controls-wrapper">
          <template #title><i class="pi pi-fw pi-cog" /> Controls</template>
          <template #content>
            <div class="controls">
              <div class="info">
                <span class="label">Monthly recurring expenses</span>
              </div>
              <Button
                id="add-expense-desktop"
                severity="secondary"
                icon="pi pi-fw pi-plus"
                label="Add Expense"
                @click="() => (store.addModalOpen = true)" />
              <Button
                id="add-expense-mobile"
                severity="secondary"
                icon="pi pi-fw pi-plus"
                label=" New"
                @click="() => (store.addModalOpen = true)" />
            </div>
          </template>
        </Card>

        <div class="summary">
          <Card>
            <template #title><i class="pi pi-fw pi-chart-bar" /> Summary</template>
            <template #content>
              <div class="summary-content">
                <div class="stats">
                  <div class="section">
                    <div class="stat-group">
                      <div class="stat">
                        <div class="label">Monthly Total</div>
                        <div class="value">
                          {{ summary.totalAmountFormatted }}
                        </div>
                      </div>
                      <div class="stat">
                        <div class="label">Expenses</div>
                        <div class="value">{{ summary.count }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <CategoryMeterGroups
                  :categoryList="transactionStore.categories"
                  :transactions="store.expenses"
                  :summary="summary" />
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="expenses-list">
        <Card class="table">
          <template #title>
            <div class="title">
              <span><i class="pi pi-fw pi-money-bill" /> Recurring Expenses</span>
            </div>
          </template>
          <template #content>
            <BudgetList :expenses="store.expenses" @rowSelect="(e) => openEditModal(e)" />
          </template>
        </Card>
      </div>
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

.controls {
  display: flex;
  margin-top: 1rem;
  gap: 1rem;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;

  @include breakpoint('mobile') {
    flex-direction: column;
  }

  .info {
    display: flex;
    align-items: center;

    .label {
      color: var(--p-text-muted-color);
    }
  }

  #add-expense-mobile {
    display: none;

    @include breakpoint('mobile') {
      display: block;
    }
  }

  #add-expense-desktop {
    @include breakpoint('mobile') {
      display: none;
    }
  }
}

.budget {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @include breakpoint('mobile') {
    gap: 1rem;
  }

  .top {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .controls-wrapper {
      width: 100%;
    }
  }
}

.summary {
  width: 100%;
  flex: 1 1 auto;

  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
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
