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
import Button from "primevue/button"
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Skeleton from 'primevue/skeleton';

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
app.component('Card', Card);
app.component('FloatLabel', FloatLabel);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('Calendar', Calendar);
app.component('Dropdown', Dropdown);
app.component('Skeleton', Skeleton);

app.use(createPinia())
app.use(router)

app.use(PrimeVue);

app.mount('#app')
