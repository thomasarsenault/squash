<script setup lang="ts">
import { computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { formatAmount } from '@/utils/helper';

const props = defineProps<{
  expenses: any[];
}>();

const emit = defineEmits(['rowSelect']);

const ordinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const formatDay = (day: number) => `${day}${ordinalSuffix(day)}`;

const expenses = computed(() =>
  [...props.expenses].sort((a, b) => {
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
    :value="expenses"
    selectionMode="single"
    :metaKeySelection="false"
    @rowSelect="(e: any) => emit('rowSelect', e.data)"
    dataKey="id">
    <template #empty>No recurring expenses found.</template>
    <Column field="day" header="Day">
      <template #body="{ data }">
        <span class="no-break">{{ formatDay(data.day) }}</span>
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
    <Column field="category" header="Category">
      <template #body="{ data }">
        <span class="no-break">{{ data.category }}</span>
      </template>
    </Column>
    <Column field="subcategory" header="Subcategory">
      <template #body="{ data }">
        {{ data.subcategory }}
      </template>
    </Column>
  </DataTable>
</template>

<style scoped lang="scss">
:deep(.p-datatable-wrapper) {
  border-radius: var(--border-radius);
}

.no-break {
  white-space: nowrap;
}
</style>
