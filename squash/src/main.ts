import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faMinus, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-purple/theme.css';
import 'primeicons/primeicons.css';

// Icons
library.add(faPlus)
library.add(faMinus)
library.add(faPenToSquare)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue);

app.mount('#app')
