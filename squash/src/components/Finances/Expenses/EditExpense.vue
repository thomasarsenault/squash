<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import InputNumber from 'primevue/inputnumber';
import { useExpensesStore } from '@/stores/expenses';
import { useTransactionStore } from '@/stores/transactions';
import dayjs from 'dayjs';
import Dialog from 'primevue/dialog';

const store = useExpensesStore();
const transactionsStore = useTransactionStore();

const expense = computed(() => store.editModal.expense);
const day = ref(1);
const name = ref('');
const category = ref({});
const amount = ref(null);
const notes = ref(null);

watch(expense, (value) => {
    const subcategories = transactionsStore.dropdownCategories.flatMap(category => category.items);
    const subcategoryObj = subcategories.find(category => category.label === value.subcategory);

    day.value = value.day;
    name.value = value.name;
    category.value = subcategoryObj;
    amount.value = value.amount;
    notes.value = value.notes;
})

const editExpense = () => {
    const updatedExpense = {
        id: expense.value.id,
        name: name.value,
        amount: amount.value,
        notes: notes.value,
        day: day.value,
        category: category.value.parentCategory || 'Other',
        subcategory: category.value.label || 'Other',
    }

    store.updateExpense(updatedExpense);
    store.editModal.open = false;
    name.value = '';
    amount.value = null;
    notes.value = null;
    category.value = '';
    day.value = 1;
}

const deleteExpense = () => {
    store.deleteExpense(expense.value);
    store.editModal.open = false;
}

</script>

<template>
    <div class="add-expense">
        <Dialog v-model:visible="store.editModal.open" header="💰 Edit Transaction">
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
                <div class="actions">
                    <Button label="Delete" severity="danger" @click="deleteExpense" />
                    <div class="right">
                        <Button label="Confirm" @click="editExpense" />
                    </div>
                </div>
            </template>
        </Dialog>
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

.actions {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .right {
        margin-left: 4rem;
        display: flex;
        gap: 0.5rem;
    }

    .checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: 1rem;
    }
}
</style>