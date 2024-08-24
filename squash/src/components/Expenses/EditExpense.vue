<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import InputNumber from 'primevue/inputnumber';
import { useTransactionStore } from '@/stores/transactions';
import dayjs from 'dayjs';
import Dialog from 'primevue/dialog';

const store = useTransactionStore();
const transaction = computed(() => store.editModal.transaction);
const date = ref(dayjs().format('MM/DD/YYYY'));
const name = ref('');
const category = ref({});
const amount = ref(null);

watch(transaction, (value) => {
    const subcategories = store.dropdownCategories.flatMap(category => category.items);
    const subcategoryObj = subcategories.find(category => category.label === value.subcategory);

    date.value = dayjs(value.date).format('MM/DD/YYYY');
    name.value = value.name;
    category.value = subcategoryObj;
    amount.value = value.amount;
})

const editExpense = () => {
    const updatedTransaction = {
        id: transaction.value.id,
        name: name.value,
        amount: amount.value,
        date: dayjs(date.value).format('YYYY-MM-DD'),
        category: category.value.parentCategory || 'Other',
        subcategory: category.value.label || 'Other',
    }

    store.updateTransaction(updatedTransaction);
    store.editModal.open = false;
    name.value = '';
    amount.value = null;
    category.value = '';
    date.value = dayjs().format('MM/DD/YYYY');
}

const deleteTransaction = () => {
    store.deleteTransaction(transaction.value);
    store.editModal.open = false;
}

</script>

<template>
    <div class="add-expense">
        <Dialog v-model:visible="store.editModal.open" header="💰 Edit Transaction">
            <div class="fields">
                <FloatLabel>
                    <Calendar id="date" v-model="date" />
                    <label for="date">Date</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="name" v-model="name"/>
                    <label for="name">Name</label>
                </FloatLabel>
                <FloatLabel>
                    <Dropdown id="category"
                        v-model="category" 
                        :options="store.dropdownCategories"
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
            </div>
            <template #footer>
                <div class="actions">
                    <Button label="Delete" severity="danger" @click="deleteTransaction" />
                    <div class="right">
                        <Button label="Add" @click="editExpense" />
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
}
</style>