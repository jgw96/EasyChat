import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
// import Rooms from '@/components/Rooms'

Vue.use(Router)

// lazy loaded routes
// const Rooms = () => import('@/components/Rooms');
const Rooms = () => import('../components/Rooms.vue');

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: Rooms
    }
  ]
})
