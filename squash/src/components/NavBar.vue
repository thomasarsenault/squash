<script setup lang="ts">
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
    <nav class="desktop-nav">
        <div v-for="item in items" :key="item.label">
            <RouterLink :to="item.to" class="nav-item">
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
            </RouterLink>
        </div>
    </nav>
</template>
  
  
  
<style scoped lang="scss">
.desktop-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem;
  background-color: var(--p-card-background);
}

.nav-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--p-text-muted-color);
  font-size: 1rem;
  gap: 0.5rem;
  padding: 0.5rem 0;
  transition: color 0.1s ease-in-out;
  
  i {
    font-size: 1.2rem;
    margin-bottom: 0.25rem;
  }
  &:hover {
    color: var(--p-primary-color);
  }

  &.router-link-active {
    color: var(--p-primary-color);
  }
}
</style>