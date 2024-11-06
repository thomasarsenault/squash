<script setup lang="ts">
import { computed, defineEmits, ref } from 'vue';
import { formatAmount } from '@/utils/helper';
import Color from '@/utils/color';
import TransactionHistory from './TransactionHistory.vue';

const props = defineProps<{
  categoryList: any,
  transactions: any,
  summary: any
}>()

const selectedCategory = ref<any>(null);
const selectedSubcategory = ref<string>('');

const filteredTransactions = computed(() => {
  if(selectedSubcategory.value) {
    return props.transactions.filter((t: any) => t.subcategory === selectedSubcategory.value);
  }

  return props.transactions.filter((t: any) => t.category === selectedCategory.value.label);
});

const categories = computed(() => {
  const categoriesObj: any = {};

  // Sum total for each category
  props.transactions.forEach((t: any) => {
    if(!categoriesObj[t.category]) {
      categoriesObj[t.category] = {
        total: 0,
        subcategories: {}
      };
    }

    categoriesObj[t.category].total += t.amount;
  });

  // Within each category, sum total for each subcategory
  props.transactions.forEach((t: any) => {
    const category = categoriesObj[t.category];

    if(!category.subcategories[t.subcategory]) {
      category.subcategories[t.subcategory] = 0;
    }

    category.subcategories[t.subcategory] += t.amount;
  });

  // Convert to sorted arrays
  const sortedCategories = Object.entries(categoriesObj)
    .map(([name, { total, subcategories }]: any) => ({ name, total, subcategories })) //cast to array
    .sort((a, b) => b.total - a.total) //sort by total descending;
    .map((category: any) => {
      const sortedSubcategories = Object.entries(category.subcategories)
        .map(([name, total]: any) => ({ name, total })) //cast to array
        .sort((a, b) => b.total - a.total); //sort by total descending

      return {
        ...category,
        subcategories: sortedSubcategories
      }
    });

    return sortedCategories;
})

const categoryBarLabels = computed(() => {
    const categoryTotals = categories.value.map(category => {

      const color = props.categoryList.find((c: any) => c.name === category.name).color;
      const shades = Color.generateShadesFromHSL(color, category.subcategories.length);

      return {
        label: category.name,
        color: Color.hslToHex(color),
        amount: category.total,
        value: category.total / props.summary.totalAmount * 100,
          subcategories: category.subcategories.map((subcategory: any, i: number) => {
            return {
              label: subcategory.name,
              color: shades[i],
              amount: subcategory.total,
              value: subcategory.total / category.total * 100,
            }
          })
        }
    });

    selectedCategory.value = categoryTotals[0];

    return categoryTotals as any;
})
</script>

<template>
    <div class="category-bars">
        <MeterGroup :value="categoryBarLabels">
            <template #label="{ value }">
                <div class="p-metergroup-label-list p-metergroup-label-list-horizontal">
                <div class="p-metergroup-label" v-for="val in value">
                    <Button severity="secondary"
                      class="p-metergroup-label-text"
                      :class="{ active: val.label === selectedCategory.label}"
                      @click="() => { selectedCategory = val; selectedSubcategory = '' }">
                        <span class="p-metergroup-label-marker" :style="{ backgroundColor: val.color }"/>
                        <span class="metergroup-category-label">{{ val.label }} ({{ formatAmount(val.amount) }})</span>
                    </Button>
                </div>
                </div>
            </template>
        </MeterGroup>
        <MeterGroup :value="selectedCategory?.subcategories || []">
            <template #label="{ value }">
                <div class="p-metergroup-label-list p-metergroup-label-list-horizontal">
                <div class="p-metergroup-label" v-for="val in value">
                    <Button severity="secondary"
                      class="p-metergroup-label-text"
                      :class="{ active: val.label === selectedSubcategory}"
                      @click="() => selectedSubcategory = val.label === selectedSubcategory ? '' : val.label">
                        <span class="p-metergroup-label-marker" :style="{ backgroundColor: val.color }"/>
                        <span class="metergroup-category-label">{{ val.label }} ({{ formatAmount(val.amount) }})</span>
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
  gap: 2rem;
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