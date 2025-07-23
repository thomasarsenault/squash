<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const items = ref([
    {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        to: '/'
    },
    {
        label: 'Agenda',
        icon: 'pi pi-fw pi-calendar',
        to: '/agenda'
    },
    {
        label: 'Expenses',
        icon: 'pi pi-fw pi-money-bill',
        to: '/expenses'
    },
    {
        label: 'Fitness',
        icon: 'pi pi-fw pi-wave-pulse',
        to: '/fitness'
    }
])
</script>

<template>
  <nav class="mobile-nav">
    <div v-for="item in items" :key="item.label">
        <RouterLink :to="item.to" class="nav-item">
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
        </RouterLink>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.mobile-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  padding: 0 1rem;
  border-top: 2px solid var(--p-surface-100);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--p-text-muted-color);
  font-size: 0.7rem;
  
  i {
    font-size: 1.2rem;
    margin-bottom: 0.25rem;
  }
  
  &.router-link-active {
    color: var(--p-primary-color);
  }
}
</style> 