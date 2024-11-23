<script setup lang="ts">
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import { useTransactionStore } from '@/stores/transactions';
import dayjs from 'dayjs';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

const store = useTransactionStore();

const date = ref(dayjs().format('MM/DD/YYYY'));
const name = ref('');
const category = ref('');
const amount = ref(null);
const notes = ref(null);
const pending = ref(false);

const addExpense = () => {
    const transaction = {
        name: name.value,
        amount: amount.value,
        date: dayjs(date.value).format('YYYY-MM-DD'),
        notes: notes.value,
        category: category.value.parentCategory || 'Other',
        subcategory: category.value.label || 'Other',
        tags: ['test tag 1', 'test tag 2'],
        pending: pending.value,
    }

    store.addTransaction(transaction);
    store.addModalOpen = false;
    name.value = '';
    amount.value = null;
    notes.value = null;
    category.value = '';
    date.value = dayjs().format('MM/DD/YYYY');
    pending.value = false;
}
</script>

<template>
    <div class="add-expense">
        <Dialog v-model:visible="store.addModalOpen" header="💰 Add Transaction" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
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
                <!-- <FloatLabel>
                    <InputText id="notes" v-model="notes"/>
                    <label for="notes">Notes</label>
                </FloatLabel> -->
            </div>
            <Accordion>
                <AccordionTab header="More Options">
                    <div class="options">
                        <div class="options-column flags">
                            <FloatLabel>
                                <InputText id="notes" v-model="notes"/>
                                <label for="notes">Notes</label>
                            </FloatLabel>
                            <span class="label">Options</span>
                            <div class="checkbox">
                                <Checkbox id="pending" v-model="pending" :binary="true"/>
                                <label for="pending">Pending</label>
                            </div>
                        </div>
                        <div class="options-column tags">
                            <span class="label">Tags</span>
                            <div class="tag">
                                <Tag value='w/ Riley' />
                                <Button icon="pi pi-times" text/>
                            </div>
                            <div class="tag">
                                <Tag value="neil's wedding" />
                                <Button icon="pi pi-times" text/>
                            </div>
                            <Button icon="pi pi-plus" label="New tag" text />
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>

            <template #footer>
                <div class="footer">
                    <Button label="Add" @click="addExpense" />
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

.footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

:deep(.p-accordionpanel) {
    border: none;
    .p-accordionheader {
        padding: 1rem 0;
    }

    .p-accordioncontent-content {
        padding: 0;
    }
}
.options {
    display: flex;
    gap: 1rem;
    .options-column {
        width: 50%;
    }

    @include breakpoint('mobile') {
        flex-direction: column;
        .options-column {
            width: 100%;
        }
    }

    .label {
        font-size: 0.75rem;
        color: var(--p-text-muted-color);
    }

    .flags {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .checkbox {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    }

}

.tags {
    display: flex;
    flex-direction: column;

    .tag {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
        width: 100%;
        gap: 0.5rem;

        .p-tag {
            width: 100%;
        }
    }
}

</style>