<script setup lang="ts">
const props = defineProps<{
    type: string,
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
    background-color: red;

    &.small {
        width: 0.5rem;
        height: 0.5rem;
    }
}

.Push {
    background-color: #ee7272;
}

.Pull {
    background-color: #5ba567;
}

.Legs {
    background-color: #87d8f8;
}

.Run, .Other {
    background-color: gray;
}
</style>
