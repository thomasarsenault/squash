<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import '@material/web/button/text-button.js';
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        Squash
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
  background-color: var(--md-sys-color-surface-container);
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
  background-color: var(--md-sys-color-surface-container);
  padding: 1rem;
}

// nav {
//   display: flex;
//   align-items: center;
//   a {
//     margin: 0.5rem 0;
//     // color: var(--color-text);
//     color: var(--md-sys-color-on-background);
//     color: white;
//     text-decoration: none;
//     font-weight: 500;
//     font-size: 1.2rem;
//     &:hover {
//       color: var(--md-sys-color-on-background);
//     }
//   }
// }
</style>
