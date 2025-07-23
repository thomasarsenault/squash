<script setup lang="ts">
// import Logo from '@/assets/logo_white.png';

const toggleDarkMode = () => {
    const isDarkMode = document.documentElement.classList.toggle('dark-mode');

    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
};

const initializeDarkMode = () => {
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedDarkMode === 'true') {
        document.documentElement.classList.add('dark-mode');
    }
};

// Initialize dark mode on component mount
initializeDarkMode();
</script>

<template>
    <div class="search-bar">
        <div class="title">
            <!-- <img :src="Logo" /> -->
            <h2>Squash</h2>
        </div>
        <div class="controls">
            <button class="dark-mode-toggle" @click="toggleDarkMode">
                <i class="pi pi-moon"></i>
            </button>
        </div>
    </div>
</template>
  
  
  
<style scoped lang="scss">
.title {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-family: 'Karla';
    padding-right: 1rem;
    margin-bottom: 4px;
    
    img {
        height: 25px;
        width: 30px;
    }

    h2 {
        margin: 0;
        padding: 0;
        font-size: 1.5rem;
        font-weight: bold;
    }
}

.search-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: var(--p-card-background);
    padding: 1rem 2rem;
    border-bottom: 2px solid var(--p-surface-100);

    @include breakpoint('mobile') {
        padding: 1rem;
    }
}

.controls {
    display: flex;
    align-items: center;
}

.dark-mode-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1.2rem;
    border-radius: 50%;
    width: 41px;
    
    &:hover {
        background-color: var(--p-surface-100);
    }
}
</style>