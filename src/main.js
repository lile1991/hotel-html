import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale'
import lang from 'element-ui/lib/locale/lang/zh-CN'

import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // 权限
import './utils/filters'

// 设置语言
locale.use(lang);

Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

/*Vue.filter(
  "timestamp2Date", function (value) {
      return value ? new Date(value) : "";
  }
);*/

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
