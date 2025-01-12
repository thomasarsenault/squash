<script setup lang="ts">
const props = defineProps<{
    type?: string,
    size?: 'small'
}>()


</script>

<template>
    <div :class="`dot ${type} ${props.size || ''}`" />
</template>

<style scoped lang="scss">
.dot {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: #bfbfbf;

    &.small {
        width: 0.5rem;
        height: 0.5rem;
    }
}

.Push {
    background-color: #ef8d8d;
}

.Pull, .Climbing {
    background-color: rgb(201, 145, 228);
}

.Legs {
    background-color: #87d8f8;
}

.Run, .Other {
    background-color: rgb(129, 206, 134);
}
</style>
