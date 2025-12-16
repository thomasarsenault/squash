<script setup lang="ts">
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';
import { formatAmount } from '@/utils/helper';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const props = defineProps<{
  expenses: any[];
}>();

const emit = defineEmits(['rowSelect']);
// const expenses = computed(() => props.expenses.sort((a, b) => dayjs(b.day).unix() - dayjs(a.day).unix()));

//sort by category then subcategory
const expenses = computed(() =>
  props.expenses.sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    if (a.subcategory < b.subcategory) return -1;
    if (a.subcategory > b.subcategory) return 1;
    return 0;
  }),
);
</script>

<template>
  <DataTable
    size="large"
    stripedRows
    removableSort
    rowGroupMode="subheader"
    groupRowsBy="category"
    :value="expenses"
    selectionMode="single"
    :metaKeySelection="false"
    @rowSelect="(e: any) => emit('rowSelect', e.data)"
    dataKey="id">
    <template #empty> No expenses found.</template>
    <Column field="category" header="Category"> </Column>
    <!-- <Column field="date" header="Date">
                  <template #body="{ data }">
                    <span class="no-break">{{ data.day }}</span>
                  </template>
                </Column> -->
    <Column></Column>
    <Column field="subcategory" header="Subcategory">
      <template #body="{ data }">
        {{ data.subcategory }}
      </template>
    </Column>
    <Column field="name" header="Name">
      <template #body="{ data }">
        <span class="no-break">{{ data.name }}</span>
      </template>
    </Column>
    <Column field="amount" header="Amount" sortable>
      <template #body="{ data }">
        {{ formatAmount(data.amount) }}
      </template>
    </Column>
    <!-- <Column field="category" header="Category">
                  <template #body="{ data }">
                    <span class="no-break">{{ data.category }}</span>
                  </template>
                </Column> -->

    <template #groupheader="data">
      <div class="category-group">
        <div>{{ data.data.category }}</div>
        <div>{{ formatAmount(data.data.amount) }}</div>
      </div>
    </template>
  </DataTable>
</template>

<style scoped lang="scss">
:deep(.p-datatable-wrapper) {
  border-radius: var(--border-radius);
}

:deep(.p-datatable-header) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.no-break {
  white-space: nowrap;
}

.category-group {
  display: flex;
  justify-content: space-between;

  div {
    font-weight: bold;
  }
}
</style>
