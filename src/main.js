import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/global.css'
import { initUser } from './services/userService.js'

// 应用启动时初始化用户身份（匿名创建或恢复已有用户）
initUser().catch((err) => {
  console.error('用户身份初始化失败：', err)
})

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
