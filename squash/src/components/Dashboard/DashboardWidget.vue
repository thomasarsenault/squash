<script setup lang="ts">
defineProps<{
  title: string;
  to: string;
  icon?: string;
}>();
</script>

<template>
  <Card>
    <template #title>
      <div class="header">
        <div class="title"><i v-if="icon" :class="`pi pi-${icon}`" /> {{ title }}</div>
        <RouterLink :to="to">
          <Button severity="secondary" label="View" />
        </RouterLink>
      </div>
    </template>
    <template #content>
      <slot></slot>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;

  .title {
    font-weight: bold;
    font-size: 1rem;
    display: flex;
    gap: 0.5rem;
    line-height: 1;
  }
}
</style>
