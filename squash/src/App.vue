<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import SearchBar from './components/SearchBar.vue';
import MobileNav from './components/MobileNav.vue';

document.addEventListener('contextmenu', e => e.preventDefault());

</script>

<template>
  <header>
    <SearchBar />
  </header>
  <div class="main-wrapper">
    <div class="nav-wrapper desktop-only">
      <NavBar />
    </div>
    <div class="container">
      <div class="view">
        <RouterView />
      </div>
    </div>
  </div>
  <div class="mobile-nav-wrapper mobile-only">
    <MobileNav />
  </div>
</template>

<style lang="scss">
// ugly dark mode overrides for primevue colors that didnt have a nice conversion
html.dark-mode {
  #app {
    background-color: black;
  }

  .search-bar {
    border-bottom: 2px solid black;
  }

  .mobile-nav {
    border-top: 2px solid black;
  }

  .dark-mode-toggle {
    &:hover {
      background-color: var(--p-surface-600);
    }
  }
}

#app {
  background-color: var(--p-surface-100);
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
</style>

<style scoped lang="scss">
header {
  font-size: 1.2rem;
  flex-shrink: 0;
  background-color: var(--p-card-background);
  z-index: 100;
}

.main-wrapper {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.nav-wrapper {
  width: 200px;
  flex-shrink: 0;
}

.mobile-nav-wrapper {
  position: fixed;
  padding-bottom: env(safe-area-inset-bottom, 45px);
  background-color: var(--p-card-background);
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.desktop-only {
  @include breakpoint('mobile') {
    display: none;
  }
}

.mobile-only {
  display: none;
  @include breakpoint('mobile') {
    display: block;
  }
}

.container {
  flex: 1;
  width: 100%;
  min-width: 0;
  overflow-y: auto;

  // 1440px is what I want the content width to be
  // 200px is the width of the nav on the left
  // 64px is the padding of the .view below
  $container-padding: calc(100% - 1440px - 200px - 64px);


  // using this instead of margin auto so that the scroll bar shows on the far right
  padding: 0 max($container-padding / 2, 0px);
  
  .view {
    margin: 2rem;

    @include breakpoint('mobile') {
      margin: 1rem;
    }
  }

  @include breakpoint('mobile') {
    padding-bottom: 60px;
  }
}
</style>
