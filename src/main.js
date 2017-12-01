// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import Toasted from 'vue-toasted';

Vue.use(Toasted);

Vue.config.ignoredElements = [
  'ion-header',
  'ion-title',
  'ion-toolbar',
  'ion-input',
  'ion-button',
  'ion-content',
  'ion-item',
  'ion-icon'
]

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
