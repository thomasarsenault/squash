<script setup lang="ts">
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import { useExpensesStore } from '@/stores/expenses';
import { useTransactionStore } from '@/stores/transactions';
import InputDialog from '@/components/InputDialog.vue';

const store = useExpensesStore();
const transactionsStore = useTransactionStore();

const day = ref(1);
const name = ref('');
const category = ref('');
const amount = ref(null);
const notes = ref(null);

const addExpense = () => {
    const expense = {
        name: name.value,
        amount: amount.value,
        day: day.value,
        notes: notes.value,
        category: category.value.parentCategory || 'Other',
        subcategory: category.value.label || 'Other',
    }

    store.addExpense(expense);
    store.addModalOpen = false;
    name.value = '';
    amount.value = null;
    notes.value = null;
    category.value = '';
    day.value = 1;
}
</script>

<template>
    <div class="add-expense">
        <InputDialog v-model:visible="store.addModalOpen" header="💰 Add Expense">
            <div class="fields">
                <FloatLabel>
                    <InputNumber id="day" :min="1" :max="28" v-model="day"/>
                    <label for="amount">Day of Month</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="name" v-model="name"/>
                    <label for="name">Name</label>
                </FloatLabel>
                <FloatLabel>
                    <Select id="category"
                        v-model="category" 
                        :options="transactionsStore.dropdownCategories"
                        optionLabel="label"
                        optionGroupLabel="label"
                        optionGroupChildren="items"
                        placeholder="Category"
                        scrollHeight="400px"/>
                    <label for="category">Category</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber id="amount" mode="currency" currency="USD" v-model="amount"/>
                    <label for="amount">Amount</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="notes" v-model="notes"/>
                    <label for="notes">Notes</label>
                </FloatLabel>
            </div>
            <template #footer>
                <div class="footer">
                    <Button label="Add" @click="addExpense" />
                </div>
            </template>
        </InputDialog>
    </div>
</template>

<style scoped lang="scss">
.fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 1.5rem;

    span input {
        width: 100%;
    }
    input {
        width: 100%;
    }

    :deep(.p-inputwrapper) {
        width: 100%;
    }
}

.footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
}


</style>