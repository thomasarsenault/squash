<script setup lang="ts">
import dayjs from 'dayjs'
import { useTasksStore } from '../stores/tasks';
import type { Task } from '../types';
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';

import Dialog from 'primevue/dialog';

// import FloatLabel from 'primevue/floatlabel';

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

const updateTask = () => {
    console.log(editedTask.value)
    store.updateTask(editedTask.value);
    editMode.value = false;
}


//watch store.editModal.task and update editedTask when it changes
watch(() => store.editModal.task, (task) => {
    //make it a deep copy
    editedTask.value = JSON.parse(JSON.stringify(task));
})

</script>

<template>
    <Dialog v-model:visible="store.editModal.isOpen" header="Edit task">
        <div v-if="editMode">
            <InputText v-model="editedTask.name" class="text-field-edit" placeholder="Task name"/>
            <Textarea v-model="editedTask.description" class="text-field-edit" placeholder="Task description"/>
        </div>
        <div v-else>
            <p>{{ editedTask.name }}</p>
            <p class="description">{{ editedTask.description }}</p>
        </div>
        <template #footer>
            <div v-if="editMode" class="actions">
                <Button label="Cancel" severity="secondary" @click="editMode = false"/>
                <Button label="Save" @click="updateTask"/>
            </div>
            <div v-else class="actions">
                <Button label="Delete" severity="danger" @click="deleteTask"/>
                <Button label="Close" severity="secondary" @click="cancelModal"/>
                <Button label="Edit" @click="editMode = true"/>
            </div>
        </template>
    </Dialog>
</template>

<style scoped lang="scss">
md-dialog {
    margin: auto;
    width: 100%;

    input {
        width: 100%;
    }

    .text-field-edit {
        width: 100%;
    }

    .description {
        white-space: pre;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        width: 100%;

        .right {
            display: flex;
            gap: 0.5rem;
        }
    }
}
</style>
