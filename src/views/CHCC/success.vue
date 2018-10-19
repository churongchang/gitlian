<template>
  <div class="main">
    <div class="top">
      <img :src="top"/>
    </div>
    <div class="charge-info">
      <div class="form-title">
        支付结果<br/>
      </div>
      <div class="success">
        <span class="title">恭喜 {{order.username}} </span><br/>
        <span class="hotel">预定 {{order.hotel.name}} </span><br/>
        <span class="date">{{order.check_at}} 至 {{order.leave_at}} </span> <br/>
        <span class="amount">共 {{order.amount / 100}} 元</span>
        <br/>
      </div>
      <div class="button">
        <el-button type="success" size="big" @click="returnEx">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/api/chcc'

export default {
  name: 'success',
  data () {
    return {
      top: undefined,
      order: {
        username: '王先生',
        hotel: {
          name: '阿尔卡迪亚大酒店'
        },
        check_at: '2017-01-12',
        leave_at: '2017-01-18',
        amount: 10000
      }
    }
  },
  created () {
    let falg = false
    let id = 0
    console.log(location.href)
    console.log(location.href.indexOf('out_trade_no'))
    if (location.href.indexOf('out_trade_no') > -1) {
      location.href.split('?')[1].split('&').forEach((item) => {
        if (item.indexOf('out_trade_no') > -1) {
          falg = true
          id = item.split('=')[1]
        }
      })
      if (falg) {
        this.getOrder(id)
      } else {
        this.$router.replace({
          path: '/error'
        })
      }
    } else {
      this.$router.replace({
        path: '/error'
      })
    }
  },
  methods: {
    returnEx () {
      let ex = this.$route.params.ex
      this.$router.push({
        path: '/exhibition/' + ex
      })
    },
    getOrder (id) {
      let that = this
      service.getOrder(id).then(rep => {
        that.order.username = rep.data.data.user_name
        that.order.hotel.name = rep.data.data.hotel.name
        that.order.check_at = rep.data.data.check_at
        that.order.leave_at = rep.data.data.leave_at
        that.order.amount = rep.data.data.amount
        that.top = rep.data.data.exhibition.cover
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .main{
    margin-top: -60px;
    width: 60%;
    margin-right: auto;
    margin-left: auto;
    .top{
      img {
        width: 60em;
        height: 25em;
      }
    }
    .success{
      margin-right: auto;
      margin-left: auto;
      padding-top: 3%;
      font-size: 2em;
      font-weight: 200;
      color: #E41313;
      .title{
        margin-left: -50%;
      }
      .amount{
        margin-left: 70%;
      }
    }
  }
</style>
