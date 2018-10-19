import Vue from 'vue'
import Router from 'vue-router'
import sign from '@/views/sign/index'
import signsuccess from '@/views/sign/success'
import videos from '@/views/videos/index'
import video from '@/views/video/index'

Vue.use(Router)
const falg = true
export default new Router({
  routes: [
    {
      path: '/sign/:id',
      name: 'sign',
      component: sign,
      meta: {
        auth: falg
      }
    }, {
      path: '/signsuccess/:id',
      name: 'signsuccess',
      component: signsuccess,
      meta: {
        auth: falg
      }
    }, {
      path: '/:type/videos',
      name: 'videos',
      component: videos,
      meta: {
        auth: falg
      }
    },
    {
      path: '/:type/video/:id',
      name: 'video',
      component: video,
      meta: {
        auth: falg
      }
    }
  ]
})
