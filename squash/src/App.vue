<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';

document.addEventListener('contextmenu', e => e.preventDefault());

</script>

<template>
  <header>
    <Navbar />
  </header>

  <div class="container">
    <RouterView />
  </div>
</template>

<style lang="scss">
#app {
  background-color: var(--p-surface-50);
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped lang="scss">

.container {
  margin: 1rem;
  flex: 1;
  // this fixes Weather overflowing, if removed double check dashboard
  overflow-x: auto;
}

header {
  font-size: 1.2rem;
  flex: 0;
}
</style>
