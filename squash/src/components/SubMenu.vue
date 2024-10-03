<script setup lang="ts">
const props = defineProps<{
  items: {
    label: string,
    icon: string,
    to: string
  }[]
}>()
</script>

<template>
  <div class="sub-header">
    <div class='sub-menu'>
      <RouterLink v-for="item in props.items" v-slot="{ href, navigate, isActive }" :to="item.to" custom>
          <a class="p-menubar-item-link" :class="{ active: isActive }" :href="href" @click="navigate" v-ripple>
              <span :class="item.icon" />
              <div class="label">{{ item.label }}</div>
          </a>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sub-header {
  width: 1440px;
  margin: auto;

  .sub-menu {
    display: flex;
    margin: 1rem 0;
    gap: 1rem;
  }

  @include breakpoint('mobile') {
    width: 100%;
  }
}

.p-menubar-item-link {
  border: 1px solid var(--p-menubar-border-color);
  border-radius: var(--p-menubar-border-radius);

  &.active {
    background-color: white;
  }
}
</style>