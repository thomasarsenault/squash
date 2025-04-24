<script setup lang="ts">
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import { useTransactionStore } from '@/stores/transactions';
import dayjs from 'dayjs';
import InputDialog from '@/components/InputDialog.vue';
import type { CategoryDropdownItem } from '@/types';

const store = useTransactionStore();

const date = ref(new Date());
const name = ref('');
const category = ref<CategoryDropdownItem['items'][number] | null>(null);
const amount = ref(null);
const notes = ref(null);
const pending = ref(false);

const addExpense = () => {
    const transaction = {
        name: name.value,
        amount: amount.value,
        date: dayjs(date.value).format('YYYY-MM-DD'),
        notes: notes.value,
        category: category.value?.parentCategory || 'Other',
        subcategory: category.value?.label || 'Other',
        pending: pending.value,
    }

    store.addTransaction(transaction);
    store.addModalOpen = false;
    name.value = '';
    amount.value = null;
    notes.value = null;
    category.value = null;
    date.value = new Date();
    pending.value = false;
}
</script>

<template>
    <div class="add-expense">
        <InputDialog v-model:visible="store.addModalOpen" header="Add Transaction" :icon="'plus'">
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
                <FloatLabel>
                    <InputText id="notes" v-model="notes"/>
                    <label for="notes">Notes</label>
                </FloatLabel>
            </div>
            <template #footer>
                <div class="footer">
                    <div class="checkbox">
                        <Checkbox id="pending" v-model="pending" :binary="true"/>
                        <label for="pending">Pending</label>
                    </div>
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