import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faMinus, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-teal/theme.css';
import Button from "primevue/button"
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';

// Icons
library.add(faPlus)
library.add(faMinus)
library.add(faPenToSquare)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('Button', Button);
app.component('Textarea', Textarea);
app.component('InputText', InputText);
app.component('Checkbox', Checkbox);

app.use(createPinia())
app.use(router)

app.use(PrimeVue);

app.mount('#app')
