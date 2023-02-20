import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import IconFont from '@/components/IconFont'

import Vant from 'vant'
// import {
//   Button,
//   Col,
//   Row,
//   Cell,
//   Icon,
//   Form,
//   Field
// } from 'vant'
// import 'vant/lib/index.css'
import 'vant/lib/index.less'
import 'lib-flexible/flexible'
import '@/assets/css/index.css'

Vue.config.productionTip = false

Vue.use(Vant)
Vue.use(IconFont)
// Vue.use(Button).use(Col).use(Row).use(Cell).use(Icon).use(Form).use(Field)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
