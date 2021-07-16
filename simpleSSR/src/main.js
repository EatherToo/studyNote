import { createApp } from 'vue' // 如何从nodemodules中拿到想要的东西
import App from './App.vue' // vue文件怎么解析
import './index.css' // css文件怎么解析
console.log(App)

createApp(App).mount('#app')


