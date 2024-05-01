<script setup lang="ts">
import dayjs from 'dayjs'
import { useTasksStore } from '../stores/tasks';
import type { Task } from '../types';
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/dialog/dialog.js';

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
    store.deleteTask(editedTask.value.id, editedTask.value.date);
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
    <md-dialog ref="modal" id="edit-task-modal" :open="store.editModal.isOpen">
        <template v-if="editMode">
            <div slot="headline">
                <md-filled-text-field
                    autofocus
                    label="Name"
                    class="text-field-edit"
                    :value="editedTask.name"
                    @input="editedTask.name = $event.target.value"
                />
            </div>
            <div slot="content">
                <md-filled-text-field
                    type="textarea"
                    label="Description"
                    class="text-field-edit"
                    :value="editedTask.description"
                    @input="editedTask.description = $event.target.value"
                />
            </div>
            <div slot="actions">
                <md-text-button @click="cancelModal">Cancel</md-text-button>
                <md-filled-button @click="updateTask">Save</md-filled-button>
            </div>
        </template>
        <template v-else>
            <div slot="headline">
                <h2>{{ editedTask.name }}</h2>
            </div>
            <div slot="content">
                <p class="description">{{ editedTask.description }}</p>
            </div>
            <div slot="actions">
                <div class="actions">
                    <div class="left">
                        <md-outlined-button @click="deleteTask">Delete</md-outlined-button>
                    </div>
                    <div class="right">
                        <md-text-button @click="cancelModal">Close</md-text-button>
                        <md-filled-button @click="editMode = true">Edit</md-filled-button>
                    </div>
                </div>
            </div>
        </template>
    </md-dialog>
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
