<script setup lang="ts">
import { ref } from 'vue';
import Rocket from '@/assets/rocket.svg';

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
    <Menubar :model="items">
        <template #start>
            <div class="title">
                <img :src="Rocket" />
                <h2>Squash</h2>
            </div>
        </template>
        <template #item="{ item }">
            <RouterLink v-slot="{ href, navigate }" :to="item.to" custom>
                <a class="p-menubar-item-link" :href="href" @click="navigate" v-ripple>
                    <span :class="item.icon" />
                    <div class="label">{{ item.label }}</div>
                </a>
            </RouterLink>
        </template>
    </Menubar>
</template>
  
  
  
<style scoped lang="scss">
.menu-wrapper {
    max-width: 1440px;
}

.p-menubar {
    border: none;
    width: 1440px;
    justify-content: space-between;
    padding: 1rem;
}

.sub-menu {
    background: none;
}

.title {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-family: 'Karla';
    padding-right: 1rem;
    margin-bottom: 4px;
    
    img {
        height: 35px;
        width: 35px;
    }

    h2 {
        margin: 0;
        padding: 0;
        font-size: 1.5rem;
        font-weight: bold;
    }
}

@include breakpoint('mobile') {
    .p-menubar {
        justify-content: space-between;
    }

    .title {
        padding-right: 0.5rem;
    }
}
</style>