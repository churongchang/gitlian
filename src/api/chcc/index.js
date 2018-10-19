import http from '@/api/http'
let wxlogin = (params) => http.post('/auth/oauth2', params)
let getFees = (data) => http.get('/fees', {
  params: data
})
let wxConfig = () => http.get('/v1/wechat/jssdk')
let WXConfig = () => http.get('/wxConfig/config')
let signSave = (params) => http.post('/sign/save', params)

let wxPay = (params) => http.post('/wxPay/unifiedorder', params)

let payType = {
  sign: 1,
  video: 2
}

let getCourse = (id) => http.get('/course/' + id)

let getVideos = (data) => http.get('/videos', {
  params: data
})
let getBuyVideos = (data) => http.get('/ordervideos/myvideos', {
  params: data
})
let checkVideo = (data) => http.get('/ordervideos/can', {
  params: data
})

let buyVideo = (params) => http.post('/ordervideos/save', params)

export default {wxlogin, wxConfig, WXConfig, getFees, signSave, payType, wxPay, getCourse, getVideos, getBuyVideos, checkVideo, buyVideo}
