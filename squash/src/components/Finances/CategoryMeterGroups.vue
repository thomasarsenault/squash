<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatAmount } from '@/utils/helper';
import Color from '@/utils/color';
import TransactionHistory from './TransactionHistory.vue';
import { getCategoryTotals } from '@/utils/expenses';

const props = defineProps<{
  categoryList: any;
  transactions: any;
  summary: any;
}>();

const selectedCategory = ref<any>(null);
const selectedSubcategory = ref<string>('');

const filteredTransactions = computed(() => {
  if (!selectedCategory.value) {
    return [];
  }

  if (selectedSubcategory.value) {
    return props.transactions.filter(
      (t: any) =>
        t.category === selectedCategory.value.label && t.subcategory === selectedSubcategory.value,
    );
  }

  return props.transactions.filter((t: any) => t.category === selectedCategory.value.label);
});

const categories = computed(() => getCategoryTotals(props.transactions));

const categoryBarLabels = computed(() => {
  const categoryTotals = categories.value.map((category) => {
    const color = props.categoryList.find((c: any) => c.name === category.name).color;
    const shades = Color.generateShadesFromHSL(color, category.subcategories.length);

    return {
      label: category.name,
      color: Color.hslToHex(color),
      amount: category.total,
      value: (category.total / props.summary.totalAmount) * 100,
      subcategories: category.subcategories.map((subcategory: any, i: number) => {
        return {
          label: subcategory.name,
          color: shades[i],
          amount: subcategory.total,
          value: (subcategory.total / category.total) * 100,
        };
      }),
    };
  });

  console.log('categoryTotals', categoryTotals);
  return categoryTotals as any;
});

// side effect ref mutation when categoryBarLabels recomputed
watch(categoryBarLabels, (newVal) => {
  selectedCategory.value = newVal[0];
  selectedSubcategory.value = '';
});
</script>

<template>
  <div class="category-bars" v-if="selectedCategory">
    <MeterGroup :value="categoryBarLabels">
      <template #label="{ value }">
        <div class="p-metergroup-label-list p-metergroup-label-list-horizontal">
          <div class="p-metergroup-label" v-for="val in value" :key="val.label">
            <Button
              severity="secondary"
              class="p-metergroup-label-text"
              :class="{ active: val.label === selectedCategory.label }"
              @click="
                () => {
                  selectedCategory = val;
                  selectedSubcategory = '';
                }
              ">
              <span class="p-metergroup-label-marker" :style="{ backgroundColor: val.color }" />
              <span class="metergroup-category-label"
                >{{ val.label }} ({{ formatAmount(val.amount) }})</span
              >
            </Button>
          </div>
        </div>
      </template>
    </MeterGroup>
    <MeterGroup :value="selectedCategory?.subcategories || []">
      <template #label="{ value }">
        <div class="p-metergroup-label-list p-metergroup-label-list-horizontal">
          <div class="p-metergroup-label" v-for="val in value" :key="val.label">
            <Button
              severity="secondary"
              class="p-metergroup-label-text"
              :class="{ active: val.label === selectedSubcategory }"
              @click="
                () => (selectedSubcategory = val.label === selectedSubcategory ? '' : val.label)
              ">
              <span class="p-metergroup-label-marker" :style="{ backgroundColor: val.color }" />
              <span class="metergroup-category-label"
                >{{ val.label }} ({{ formatAmount(val.amount) }})</span
              >
            </Button>
          </div>
        </div>
      </template>
    </MeterGroup>
  </div>
  <div class="transactions">
    <TransactionHistory scrollable scrollHeight="400px" :transactions="filteredTransactions" />
  </div>
</template>

<style scoped lang="scss">
.category-bars {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

:deep(.p-metergroup-horizontal .p-metergroup-meters) {
  height: 16px;
}

.p-metergroup-label {
  .active {
    font-weight: bold;
    background: var(--p-button-secondary-hover-background);
    border: 1px solid var(--p-button-secondary-hover-border-color);
    color: var(--p-button-secondary-hover-color);
  }
}
</style>
