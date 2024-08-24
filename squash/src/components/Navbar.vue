<script setup lang="ts">
import { ref } from 'vue';
    
const navItems = [
    { name: '🌄 Dashboard', path: '/' },
    { name: '📝 Agenda', path: '/agenda' },
    { name: '💸 Expenses', path: '/expenses' },
];

const isOpen = ref(false);

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};
</script>

<template>
    <nav class="navbar">
        <h2>🦋 Squash</h2>
        <div class="hamburger" @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
        </div>
        
        <ul :class="['nav-items', { 'is-open': isOpen }]">
            <li v-for="item in navItems" :key="item.name">
                <RouterLink :to="item.path" @click="toggleMenu">
                    <Button severity="secondary" outlined>{{ item.name }}</Button>
                </RouterLink>
            </li>
        </ul>

    </nav>
</template>
  
  
  
<style scoped lang="scss">
// shoutout ChatGPT for most of this CSS
.navbar {
    display: flex;
    flex-direction: column;
    width: 175px;
    padding: 1rem;
    align-items: flex-start;

    h2 {
        margin: 0 0 1.5rem;
        padding: 0;
    }
}

.nav-items {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

.nav-items li {
    margin-bottom: 0.5rem;
    border-radius: 16px;
    width: 100%;

    button {
        width: 100%;
        white-space: nowrap;
    }
}

.nav-items li a {
    text-decoration: none;
    color: #333;
}

.hamburger {
    display: none;
    cursor: pointer;
    flex-direction: column;
    justify-content: space-around;
    height: 20px;
    width: 30px;
}

.hamburger span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: var(--text-secondary-color);
    border-radius: 2px;
}

@include breakpoint('mobile') {
    .navbar {
        width: 100%;
        height: auto;
        padding: 0.5rem 1rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        h2 {
            margin: 0;
        }
    }

    .hamburger {
        display: flex;
    }

    .nav-items {
        flex-direction: column;
        position: absolute;
        top: 50px;
        right: 0;
        width: 100%;
        display: none;
        padding: 0.5rem;
        background-color: var(--surface-ground);
        z-index: 1;
    }

    .nav-items.is-open {
        display: flex;
    }
}
</style>