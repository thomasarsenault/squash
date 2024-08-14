<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

document.addEventListener('contextmenu', e => e.preventDefault());

</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <font-awesome-icon icon="fa-solid fa-minus" size="xs" :style="{ color: 'white' }"/>
          <RouterLink to="/">
            <a>Squash</a>
          </RouterLink>
        <font-awesome-icon icon="fa-solid fa-minus" size="xs" :style="{ color: 'white' }"/>
        <RouterLink to="/agenda">
          <a>Agenda</a>
        </RouterLink>
        <RouterLink to="/expenses">
          <a>Expenses</a>
        </RouterLink>
        <!-- <RouterLink to="/">
          <md-text-button>
            Agenda
          </md-text-button>
        </RouterLink>
        <RouterLink to="/settings">
          <md-text-button>
            Settings
          </md-text-button>
        </RouterLink> -->
      </nav>
    </div>
  </header>

  <div class="container">
    <RouterView />
  </div>
</template>

<style lang="scss">
#app {
  background-color: var(--surface-ground);
  width: 100vw;
  display: flex;
  flex-direction: column;

}
</style>

<style scoped lang="scss">

.container {
  margin: 1rem;
  border-radius: 16px;
  flex: 1;
}

header {
  width: 100%;
  background-color: var(--primary-color);
  padding: 1rem;
  color: white;
  font-size: 32px;
}
nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  a {
    font-size: 1.2rem;
    text-decoration: none;
    color: var(--primary-color-text);

    &:hover {
      color: var(--text-secondary-color);
    }
  }
}
</style>
