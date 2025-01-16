import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router';
import axios from 'axios';
import Cookies from 'js-cookie';

const app = createApp(App);

app.use(ElementPlus);
app.use(router);

const token = Cookies.get('jwt_token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

app.mount('#app');