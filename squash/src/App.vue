<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';

document.addEventListener('contextmenu', e => e.preventDefault());


</script>

<template>
  <header class="p-menubar menubar-wrapper">
    <Navbar />
  </header>


  <div class="container">
    <div class="view">
      <RouterView />
    </div>
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
  flex: 1;
  // this fixes Weather overflowing, if removed double check dashboard
  overflow-x: auto;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;

  .view {
    margin: 1rem;
  }
}

header {
  font-size: 1.2rem;
  flex: 0;
}

.menubar-wrapper {
  padding: 0;
  justify-content: center;
  border-top: none;
}
</style>
