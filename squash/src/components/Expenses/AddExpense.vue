<script setup lang="ts">
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import { useTransactionStore } from '@/stores/transactions';
import dayjs from 'dayjs';
import Dialog from 'primevue/dialog';

const store = useTransactionStore();

const date = ref(dayjs().format('MM/DD/YYYY'));
const name = ref('');
const category = ref('');
const amount = ref(null);

const addExpense = () => {
    const transaction = {
        name: name.value,
        amount: amount.value,
        date: dayjs(date.value).format('YYYY-MM-DD'),
        category: category.value.parentCategory || 'Other',
        subcategory: category.value.label || 'Other',
    }

    store.addTransaction(transaction);
    store.addModalOpen = false;
    name.value = '';
    amount.value = null;
    category.value = '';
    date.value = dayjs().format('MM/DD/YYYY');
}
</script>

<template>
    <div class="add-expense">
        <Dialog v-model:visible="store.addModalOpen" header="💰 Add Transaction">
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
                    <Select id="category"
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
                <Button label="Add" @click="addExpense" />
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

</style>