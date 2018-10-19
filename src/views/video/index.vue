<template>
  <div class="main">
    <div class="video">
      <video width="100%" preload controls  :src="video.url"></video>
    </div>
    <div v-if="!payState">
      <div class="mask"></div>
      <div class="box">
        <div class="header">提示</div>
        <div class="box-content">您未购买此视频 该视频为￥ {{(video.price / 100).toFixed(2)}} 元 是否购买？</div>
        <div class="btns">
          <button class="mint-msgbox-btn mint-msgbox-cancel" style="" @click="cancel">取消</button>
          <button class="mint-msgbox-btn mint-msgbox-confirm" @click="sure">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/api/chcc'
// import { MessageBox } from 'mint-ui'
import wx from 'weixin-js-sdk'
export default {
  name: 'success',
  data () {
    return {
      video: {},
      payState: true
    }
  },
  watch: {
    '$route' (to, from) {
      this.video = JSON.parse(this.$route.query.video)
      this.check()
    }
  },
  mounted () {
    service.WXConfig().then((res) => {
      wx.config(res.data.data)
    })
    this.video = JSON.parse(this.$route.query.video)
    this.check()
  },
  methods: {
    check () {
      const that = this
      const params = new URLSearchParams()
      params.append('videoId', this.$route.params.id)
      service.checkVideo(params).then(res => {
        that.payState = res.data.data
        if (!res.data.data) {
          // MessageBox({
          //   message: '您未购买此视频  该视频为￥ ' + (this.video.price / 100).toFixed(2) + '元 是否购买?',
          //   showCancelButton: true,
          //   closeOnClickModal: false
          // }).then(cca => {
          //   if (cca === 'confirm') {
          //     const buyparams = new URLSearchParams()
          //     buyparams.append('videoId', that.$route.params.id)
          //     buyparams.append('fee', that.video.price)
          //     service.buyVideo(buyparams).then(buyres => {
          //       const wxpayparams = new URLSearchParams()
          //       wxpayparams.append('totalFee', buyres.data.data.totalFee)
          //       wxpayparams.append('type', service.payType.video)
          //       wxpayparams.append('outTradeNo', buyres.data.data.outTradeNo)
          //       service.wxPay(wxpayparams).then(payrep => {
          //         payrep.data.data.success = (payres) => {
          //           that.$router.push({
          //             path: '/' + that.$route.params.type + '/video/' + that.$route.params.id,
          //             query: {
          //               video: JSON.stringify(that.video)
          //             }
          //           })
          //         }
          //         payrep.data.data.timestamp = payrep.data.data.timeStamp
          //         wx.chooseWXPay(payrep.data.data)
          //       })
          //     })
          //   } else {
          //     that.returnVideos()
          //   }
          // })
        }
      })
    },
    returnVideos () {
      this.$router.push({
        path: '/' + this.$route.params.type + '/videos'
      })
    },
    cancel () {
      this.returnVideos()
    },
    sure () {
      this.pay()
    },
    pay () {
      let that = this
      const buyparams = new URLSearchParams()
      buyparams.append('videoId', that.$route.params.id)
      buyparams.append('fee', that.video.price)
      service.buyVideo(buyparams).then(buyres => {
        const wxpayparams = new URLSearchParams()
        wxpayparams.append('totalFee', buyres.data.data.totalFee)
        wxpayparams.append('type', service.payType.video)
        wxpayparams.append('outTradeNo', buyres.data.data.outTradeNo)
        service.wxPay(wxpayparams).then(payrep => {
          payrep.data.data.success = (payres) => {
            that.check()
          }
          payrep.data.data.timestamp = payrep.data.data.timeStamp
          wx.chooseWXPay(payrep.data.data)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .main{
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    .video{
      margin-top: 40%
    }
  }
  .mask{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
  }
  .box{
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    background-color: #fff;
    width: 85%;
    border-radius: 3px;
    font-size: 16px;
    -webkit-user-select: none;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transition: .2s;
    transition: .2s;
  }
  .box-content{
    padding: 10px 20px 15px;
    border-bottom: 1px solid #ddd;
    min-height: 36px;
    position: relative;
    color: #999;
    margin: 0;
    text-align: center;
    line-height: 36px;
  }
  .header{
    padding: 15px 0 0;
    text-align: center;
    margin-bottom: 0;
    font-size: 16px;
    font-weight: 700;
    color: #333;
  }
  .btns{
    display: flex;
  }
  .mint-msgbox-btn {
    line-height: 35px;
    display: block;
    background-color: #fff;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin: 0;
    border: 0;
  }
  .mint-msgbox-confirm {
    color: #26a2ff;
    width: 50%;
  }
  .mint-msgbox-cancel {
    width: 50%;
    border-right: 1px solid #ddd;
  }
</style>
