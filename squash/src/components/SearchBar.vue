<script setup lang="ts">
import Logo from '@/assets/logo_white.png';


</script>

<template>
    <div class="search-bar">
        <div class="title">
            <img :src="Logo" />
            <h2>Squash</h2>
        </div>
        <!-- <InputText placeholder="Search" /> -->
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
    background-color: white;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--p-surface-100);

    @include breakpoint('mobile') {
        padding: 1rem;
    }
}
</style>