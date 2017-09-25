import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import TravelExpenseList from '@/components/TravelExpenseList'
import TEReport from '@/components/TEReport'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TravelExpenseList',
      component: TravelExpenseList
    }
    ,
    {
      path: '/TEReport',
      name: 'TEReport',
      component: TEReport
    }
    ,
    {
      path: '/Hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
