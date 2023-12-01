import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './assets/css/theme.less'

const app = createApp(App)

// 配置路由
app.use(router)

app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })