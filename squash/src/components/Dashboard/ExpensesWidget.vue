<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactions';
import dayjs from 'dayjs';
import { getCategoryTotals } from '@/utils/expenses';
import Color from '@/utils/color';
import { formatAmount } from '@/utils/helper';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const store = useTransactionStore();

onMounted(async () => {
  store.getTransactions().then(() => {
    console.log('tasks', store.transactions);
  })
})

const startOfWeek = dayjs()
		.subtract(1, 'day') // offset week if on a sunday - dayjs weeks start on sundays (weird and wrong)
		.startOf('week') // get the sunday
		.add(1, 'day') // make it monday (the correct start to the week)
const endOfWeek = startOfWeek.add(1, 'week').subtract(1, 'day');

const transactions = computed(() => {
    return store.transactions.filter((transaction) => {
        return !transaction.pending
            && dayjs(transaction.date).isSameOrAfter(startOfWeek) && dayjs(transaction.date).isSameOrBefore(endOfWeek)
    })
})
const summary = computed(() => {
    const totalAmount = transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0);

    return {
        totalAmount: totalAmount,
        totalAmountFormatted: formatAmount(totalAmount),
        count: transactions.value.length
    }
})

const categories = computed(() => getCategoryTotals(transactions.value));

const categoryLabels = computed(() => {
    return categories.value.map(category => {
        const color = store.categories?.find((c) => c.name === category.name)?.color || [];

        return {
            label: category.name,
            color: Color.hslToHex(color),
            amount: category.total,
            value: category.total / summary.value.totalAmount * 100,
        }
    })
})
</script>

<template>
    <Card>
        <template #title>
            <div class="title">
                <span>💸 Money</span>
                <RouterLink :to="'/expenses'">
                    <Button severity="secondary" label="View" />
                </RouterLink>
            </div>
        </template>
        <template #content>
            <div class="expenses">
                <div class="stats">
                    <div class="section">
                        <div class="stat-group">
                            <div class="stat">
                                <div class="label">Spent</div>
                                <div class="value">{{ summary.totalAmountFormatted }}</div>
                            </div>
                            <div class="stat">
                                <div class="label">Transactions</div>
                                <div class="value">{{ summary.count }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <MeterGroup :value="categoryLabels">
                    <template #label="{ value }">
                        <div class="p-metergroup-label-list p-metergroup-label-list-horizontal">
                        <div class="p-metergroup-label" v-for="val in value" :key="val.label">
                            <span class="p-metergroup-label-marker" :style="{ backgroundColor: val.color }"/>
                            <span class="metergroup-category-label">{{ val.label }} ({{ formatAmount(val.amount) }})</span>
                        </div>
                        </div>
                    </template>
                </MeterGroup>
            </div>
        </template>
    </Card>
</template>

<style scoped lang="scss">

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.expenses {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

:deep(.p-metergroup-horizontal .p-metergroup-meters) {
	height: 16px;
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

			// @include breakpoint('mobile') {
			// 	justify-content: space-between;
			// }

			.stat {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;

				// @include breakpoint('mobile') {
				// 	align-items: center;
				// }

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
</style>