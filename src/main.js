// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import wxApi from '@/api/chcc'
import WechatAuth from './utils/wechat'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)

// 微信授权插件初始化
Vue.use(WechatAuth, {
  router, // 路由实例对象
  appid: process.env.WXAppID, // 您的微信appid
  responseType: 'code', // 返回类型，请填写code
  scope: process.env.WXScope, // 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息）
  getCodeCallback (code, next) {
    const params = new URLSearchParams()
    params.append('code', code)
    wxApi.wxlogin(params).then((res) => {
      let bind = res.data.data
      localStorage.setItem('token', bind.token)
      next(bind.access_token)
    })
  }
})

Vue.config.productionTip = false

Vue.use(ElementUI, {
  siz: 'small'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
