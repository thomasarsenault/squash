<script setup lang="ts">
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import { useTransactionStore } from '@/stores/transactions';
import dayjs from 'dayjs';
import Dialog from 'primevue/dialog';

const store = useTransactionStore();

const name = ref('');
const category = ref('');
const amount = ref(null);

const addExpense = () => {
    const transaction = {
        id: store.transactions.length + 1,
        name: name.value,
        amount: amount.value,
        date: dayjs().format('YYYY-MM-DD'),
        category: category.value,
        subcategory: category.value,
    }

    store.addTransaction(transaction);
    store.addModalOpen = false;
}
</script>

<template>
    <div class="add-expense">
        <Dialog v-model:visible="store.addModalOpen" header="💰 Add Transaction">
            <div class="fields">
                <FloatLabel>
                    <InputText id="name" v-model="name"/>
                    <label for="name">Name</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="category" v-model="category"/>
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
    margin-top: 1rem;

    span input {
        width: 100%;
    }
    input {
        width: 100%;
    }
}
</style>