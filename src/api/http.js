import http from 'axios'

import { Message } from 'element-ui'

http.defaults.baseURL = process.env.BaseURL

http.interceptors.request.use(function (config) {
  config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
  return config
}, function (error) {
  return Promise.reject(error)
})

http.interceptors.response.use(function (response) {
  return response
}, function (error) {
  console.log(error.response)
  switch (error.response.status) {
    case 422:
      Message.error(error.response.data.message)
      break
    case 500:
      Message.error('服务器错误')
      break
    default:
  }
  return Promise.reject(error.response)
})

export default http
