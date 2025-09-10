import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faMinus, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import { updatePrimaryPalette } from '@primevue/themes';


// Icons
library.add(faPlus)
library.add(faMinus)
library.add(faPenToSquare)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark-mode',
            cssLayer: false
        }
    }
});

updatePrimaryPalette({
    50: '{sky.50}',
    100: '{sky.100}',
    200: '{sky.200}',
    300: '{sky.300}',
    400: '{sky.400}',
    500: '{sky.500}',
    600: '{sky.600}',
    700: '{sky.700}',
    800: '{sky.800}',
    900: '{sky.900}',
    950: '{sky.950}'
});

app.mount('#app')
