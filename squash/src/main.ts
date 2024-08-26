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
            darkModeSelector: '',
            cssLayer: false
        }
    }
});

updatePrimaryPalette({
    50: '{violet.50}',
    100: '{violet.100}',
    200: '{violet.200}',
    300: '{violet.300}',
    400: '{violet.400}',
    500: '{violet.500}',
    600: '{violet.600}',
    700: '{violet.700}',
    800: '{violet.800}',
    900: '{violet.900}',
    950: '{violet.950}'
});

app.mount('#app')
