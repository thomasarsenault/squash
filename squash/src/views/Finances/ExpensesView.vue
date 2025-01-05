<script setup lang="ts">
import dayjs from 'dayjs';
import { useTransactionStore } from '@/stores/transactions';
import { onMounted, ref, computed } from 'vue';
import AddTransaction from '@/components/Finances/AddTransaction.vue';
import EditTransaction from '@/components/Finances/EditTransaction.vue';
import TransactionHistory from '@/components/Finances/TransactionHistory.vue';
import { formatAmount } from '@/utils/helper';
import CategoryMeterGroups from '@/components/Finances/CategoryMeterGroups.vue';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import type { Transaction } from '@/types';

const NUM_MONTHS_TO_SHOW = 6;
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const store = useTransactionStore();
const MONTHS: Array<{label: string, value: number, index: number}> = [];

// populate last 6 months including current one at the end of the array
for(let i = NUM_MONTHS_TO_SHOW - 1; i >= 0; i--) {
	const monthNumber = dayjs().month() - i;

	MONTHS.push({ label: dayjs().month(monthNumber).format('MMMM'), value: monthNumber < 0 ? monthNumber + 12 : monthNumber, index: NUM_MONTHS_TO_SHOW - i - 1 })
}

onMounted(async () => {
	store.getTransactions().then(() => {
		console.log('transactions', store.transactions);
	})
})

const showFilters = ref(false);

const selectedMonth = ref(MONTHS[MONTHS.length - 1]);

const pendingTransactions = computed(() => {
	return store.transactions.filter((transaction) => transaction.pending);
});

const transactions = computed(() => {
	return store.transactions.filter((transaction) => !transaction.pending);
});


const openEditModal = (transaction: Transaction) => {
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

const selectedViewOptions = ref([
	{ label: 'Week', value: 'week' },
	{ label: 'Month', value: 'month' }
]);
const selectedView = ref(selectedViewOptions.value[0]);

// last 8 weeks as selection options
// range from Monday to Sunday inclusive
const weekOptions = ref(Array.from({ length: 8 }, (_, i) => {
	const startOfWeek = dayjs()
		.subtract(1, 'day') // offset week if on a sunday - dayjs weeks start on sundays (weird and wrong)
		.startOf('week') // get the sunday
		.add(1, 'day') // make it monday (the correct start to the week)
		.subtract(i, 'week'); // go i weeks in the past

	const endOfWeek = startOfWeek
		.add(1, 'week') // next monday
		.subtract(1, 'day'); // sunday (the end of the inclusive range)

	return {
		label: `${startOfWeek.format('MMMM D')} - ${endOfWeek.format('D')}`,
		value: i,
		dateRange: [startOfWeek, endOfWeek]
	}
}));
const selectedWeekDateRange = ref(weekOptions.value[0]);

const selectedTransactions = computed(() => {
	if(selectedView.value.value === 'week') {
		return transactions.value.filter((transaction) => {
			return dayjs(transaction.date).isSameOrAfter(selectedWeekDateRange.value.dateRange[0]) && dayjs(transaction.date).isSameOrBefore(selectedWeekDateRange.value.dateRange[1]);
		}) || [];
	}

	return transactions.value.filter((transaction) => {
		return dayjs(transaction.date).month() === selectedMonth.value.value;
	}) || [];
});

const summary = computed(() => {
	const totalAmount = selectedTransactions.value.reduce((acc, transaction) => acc + transaction.amount, 0);
	return {
		totalAmount: totalAmount,
		totalAmountFormatted: formatAmount(totalAmount),
		count: selectedTransactions.value.length
	}
})

</script>

<template>
	<SubMenu :items="items"/>
	<main>
		<div class="expenses">
			<div class="top">
				<div class="controls">
					<div class="range">
						<SelectButton :options="selectedViewOptions" v-model="selectedView" optionLabel="label" :allowEmpty="false"/>
						<div class="selector" v-if="selectedView.value === 'week'">
							<Button severity="secondary" label="-"
								@click="() => selectedWeekDateRange = weekOptions[selectedWeekDateRange.value + 1]"
								:disabled="!weekOptions[selectedWeekDateRange.value + 1]"
								/>
							<Select v-model="selectedWeekDateRange"
								:options="weekOptions"
								optionLabel="label"/>
							<Button severity="secondary" label="+"
								@click="() => selectedWeekDateRange = weekOptions[selectedWeekDateRange.value - 1]"
								:disabled="!weekOptions[selectedWeekDateRange.value - 1]"
								/>
						</div>
						<div class="selector" v-else>
							<Button severity="secondary" label="-"
								@click="() => selectedMonth = MONTHS[selectedMonth.index - 1]"
								:disabled="!MONTHS[selectedMonth.index - 1]"
								/>
							<Select v-model="selectedMonth"
								:options="MONTHS"
								optionLabel="label"/>
							<Button severity="secondary" label="+"
								@click="() => selectedMonth = MONTHS[selectedMonth.index + 1]"
								:disabled="!MONTHS[selectedMonth.index + 1]"
								/>
						</div>
					</div>
					<Button label="Add Transaction" @click="() => store.addModalOpen = true"/>
				</div>
				<div class="summary">
					<Card>
						<template #title>📊 Summary</template>
						<template #content>
							<div class="summary-content">
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
								<CategoryMeterGroups
									:categoryList="store.categories"
									:transactions="selectedTransactions"
									:summary="summary"/>
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
			<div class="pending">
				<Card>
					<template #title>🕒 Pending Transactions</template>
					<template #content>
						<TransactionHistory :transactions="pendingTransactions" @rowSelect="(e) => openEditModal(e)"/>
					</template>
				</Card>
			</div>
		</div>
		<AddTransaction id="add-transaction-dialog"/>
		<EditTransaction id="edit-transaction-dialog"/>
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

.action-bar {
	display: flex;
	gap: 1rem;
	justify-content: space-between;
}

.controls {
	display: flex;
	gap: 1rem;
	align-items: center;
	width: 100%;
	justify-content: space-between;
	flex-wrap: wrap;

	@include breakpoint('mobile') {
		flex-direction: column-reverse;
	}

	.range {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;

		@include breakpoint('mobile') {
			justify-content: center;
		}
	}

	.selector {
		display: flex;
		gap: 0.25rem;

		.p-select {
			width: 200px;
		}
	}
}

.expenses {
	display: flex;
	flex-direction: column;
	gap: 1rem;

	.top {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;

		// .statistics {
		//   flex: 1 1 auto;
		//   .p-card {
		//     height: 100%;
		//   }
		// }
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