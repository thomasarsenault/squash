<script setup lang="ts">
import { ref } from 'vue';
import Rocket from '@/assets/rocket.svg';
import Hamburger from '@/assets/hamburger.svg';

const navItems = [
    { name: '😎 Dashboard', path: '/' },
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
        <div class="title">
            <img :src="Rocket" />
            <h2>Squash</h2>
        </div>
        <div class="hamburger" @click="toggleMenu">
            <img :src="Hamburger" />
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

    .title {
        display: flex;
        gap: 0.5rem;
        padding-bottom: 1.5rem;
        align-items: center;
        font-family: 'Karla';
        
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
    img {
        height: 30px;
        width: 30px;
    }
}

@include breakpoint('mobile') {
    .navbar {
        width: 100%;
        height: auto;
        padding: 0.5rem 1rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .title {
            padding: 1rem 0 0.5rem;
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
        margin-top: 1.5rem;
    }

    .nav-items.is-open {
        display: flex;
    }
}
</style>