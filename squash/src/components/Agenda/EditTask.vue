<script setup lang="ts">
import dayjs from 'dayjs'
import { useTasksStore } from '@/stores/tasks';
import type { Task } from '@/types';
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';

import Dialog from 'primevue/dialog';
import SelectButton from 'primevue/selectbutton';

const dateOptions = [
    {
        label: 'Today',
        value: dayjs().format('YYYY-MM-DD')
    },
    {
        label: 'Tomorrow',
        value: dayjs().add(1, 'day').format('YYYY-MM-DD')
    },
    {
        label: 'This Week',
        value: dayjs().add(7, 'day').format('YYYY-MM-DD')
    }
]
const store = useTasksStore();
const modal = ref<HTMLElement | null>(null);
const editedTask = ref<Task>({} as Task);
const editMode = ref(false);

const cancelModal = () => {
    console.log('cancel modal')
    store.editModal.isOpen = false;
    editMode.value = false;
}

const deleteTask = () => {
    store.deleteTask(editedTask.value.id, dayjs(editedTask.value.date).format('YYYY-MM-DD'));
    cancelModal();
}

//onmounted
onMounted(() => {
    modal.value?.addEventListener('cancel', cancelModal)
})

onUnmounted(() => {
    modal.value?.removeEventListener('cancel', cancelModal)
})

const updateTask = async () => {
    store.updateTask(editedTask.value);

    const newDate = dayjs(editedTask.value.date).format('YYYY-MM-DD');
    const oldDate = store.editModal.task.date;

    //TODO: god this needs to be shared logic for task ranks. shouldve waited til the end to implement re-ordering (i am an idiot)
    if(newDate !== oldDate) {
        const newDate = dayjs(editedTask.value.date).format('YYYY-MM-DD');
        const oldDate = store.editModal.task.date;

        const newRanks = [...store.taskRanks[newDate] || [], editedTask.value.id];
        const oldRanks = store.taskRanks[oldDate].filter(id => id !== editedTask.value.id);

        await store.updateTaskRanks(newRanks, newDate);
        await store.updateTaskRanks(oldRanks, oldDate);
        store.editModal.task = editedTask.value;
    }
    editMode.value = false;
}


//watch store.editModal.task and update editedTask when it changes
watch(() => store.editModal.task, (task) => {
    //make it a deep copy
    editedTask.value = JSON.parse(JSON.stringify(task));
})

</script>

<!-- TODO: add wysiwyg editor -->
<template>
    <Dialog v-model:visible="store.editModal.isOpen" :header="editedTask.name">
        <div v-if="editMode" class="edit">
            <InputText v-model="editedTask.name" class="text-field-edit" placeholder="Task name"/>
            <Textarea v-model="editedTask.description" class="text-field-edit" placeholder="Task description"/>
            <SelectButton v-model="editedTask.date" :options="dateOptions" optionLabel="label" optionValue="value"/>
        </div>
        <div v-else class="view">
            <p v-if="editedTask.description" class="description">{{ editedTask.description }}</p>
        </div>
        <template #footer>
            <div v-if="editMode" class="actions">
                <Button label="Cancel" severity="secondary" @click="editMode = false"/>
                <Button label="Save" @click="updateTask"/>
            </div>
            <div v-else class="actions">
                <Button label="Delete" severity="danger" @click="deleteTask"/>
                <div class="right">
                    <Button label="Edit" @click="editMode = true"/>
                    <Button label="Close" severity="secondary" @click="cancelModal"/>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped lang="scss">
input {
    width: 100%;
}

.text-field-edit {
    width: 100%;
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


.view, .edit {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
