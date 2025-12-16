<script setup lang="ts">
const props = defineProps<{
  items: {
    label: string;
    icon: string;
    to: string;
  }[];
}>();
</script>

<template>
  <div class="sub-header">
    <div class="sub-menu">
      <RouterLink
        v-for="item in props.items"
        v-slot="{ href, navigate, isActive }"
        :to="item.to"
        custom>
        <a
          class="sub-menu-item"
          :class="{ active: isActive }"
          :href="href"
          @click="navigate"
          v-ripple>
          <span :class="item.icon" />
          <span class="label">{{ item.label }}</span>
        </a>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sub-header {
  width: 1440px;
  margin: auto;

  @include breakpoint('mobile') {
    width: 100%;
  }
}

.sub-menu {
  display: inline-flex;
  gap: 0.5rem;
  padding: 0.25rem;
  margin-bottom: 1rem;
  border: 1px solid var(--p-surface-border);
  border-radius: var(--p-border-radius-lg);

  @include breakpoint('mobile') {
    display: flex;
    justify-content: center;
    margin: 1rem;
  }
}

.sub-menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--p-border-radius-md);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: var(--p-text-color);
  }

  &.active {
    color: var(--p-primary-color);
    background-color: var(--p-card-background);
  }

  .label {
    white-space: nowrap;
  }
}
</style>
