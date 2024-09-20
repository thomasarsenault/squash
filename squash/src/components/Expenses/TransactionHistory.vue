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
  transactions: any[],
  showFilters: boolean
}>()

const emit = defineEmits(['rowSelect'])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  date: { value: null, matchMode: FilterMatchMode.EQUALS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  amount: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  category: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  subcategory: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const formatDate = (date: string) => dayjs(date).format('ddd, Do');
const transactions = computed(() => props.transactions.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()));
// const filteredData = ref(transactions.value);

// const totalAmount = computed(() => {
//   return formatAmount(filteredData.value.reduce((acc, transaction) => acc + transaction.amount, 0));
// });

const onFiltered = (event: any) => {
  // filteredData.value = event.filteredValue;
}
</script>

<template>
<DataTable size="large" stripedRows removableSort
                :value="transactions"
                v-model:filters="filters"
                :filterDisplay="showFilters ? 'row' : undefined"
                selectionMode="single"
                :metaKeySelection="false"
                @rowSelect="(e: any) => emit('rowSelect', e.data)"
                @filter="onFiltered"
                dataKey="id">
              <template #empty> No transactions found.</template>
              <Column field="date" header="Date">
                  <template #body="{ data }">
                    <span class="no-break">{{ formatDate(data.date) }}</span>
                  </template>
                  <template #filter="{ filterModel, filterCallback }">
                      <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by date" />
                  </template>
                </Column>
                <Column field="name" header="Name">
                  <template #body="{ data }">
                    <span class="no-break">{{ data.name }}</span>
                  </template>
                  <template #filter="{ filterModel, filterCallback }">
                      <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
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
                  <template #filter="{ filterModel, filterCallback }">
                      <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by category" />
                  </template>
                </Column>
                <Column field="subcategory" header="Subcategory">
                  <template #body="{ data }">
                      {{ data.subcategory }}
                  </template>
                  <template #filter="{ filterModel, filterCallback }">
                      <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by subcategory" />
                  </template>
                </Column>
              </DataTable>
</template>

<style scoped lang="scss">
:deep(.p-datatable-wrapper) {
  border-radius: var(--border-radius)
}

:deep(.p-datatable-header) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.search {
  display: flex;
}

.no-break {
  white-space: nowrap;  
}
</style>