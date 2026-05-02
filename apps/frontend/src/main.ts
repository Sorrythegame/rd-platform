import { createApp } from 'vue'
import App from './App.vue'

// 引入 Ant Design Vue
import Antd from 'ant-design-vue';
// 引入 Ant Design Vue 样式
import 'ant-design-vue/dist/reset.css';

const app = createApp(App)

// 注册全局 UI 库
app.use(Antd)
app.mount('#app')
