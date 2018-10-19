<template>
  <div class="main">
    <div class="top">
      <img :src="top"/>
    </div>
    <div class="order-info">
      <div class="form-title-m">
        订单查询<br/>
      </div>
      <div class="filter-m">
      <el-input class="filter-item" style="width: 160px" v-model="querymobile" placeholder="请输入手机号"></el-input>
      <el-button class="filter-item" type="primary" @click="getOrders">查询</el-button>
      <el-button class="filter-item" type="success" @click="returnEx">返回</el-button>
    </div>
      <div>
        <el-table
          :data="orders"
          v-loading="loading"
          style="width: 100%; margin-top: 20px">
          <el-table-column align="center" prop="user_name" min-width="50px" label="姓名"></el-table-column>
          <el-table-column align="center" prop="user_mobile" label="电话"></el-table-column>
          <el-table-column align="center" prop="hotel.name" label="酒店"></el-table-column>
          <el-table-column align="center"  label="日期">
            <template slot-scope="scope">
              {{ scope.row.check_at + '至' +scope.row.leave_at }}
            </template>
          </el-table-column>
          <el-table-column align="center"  label="金额">
            <template slot-scope="scope">
              {{ scope.row.amount / 100 + '元' }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status_text" label="状态"></el-table-column>
        </el-table>
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
      orders: [],
      querymobile: undefined,
      loading: false
    }
  },
  created () {
    this.getEx(this.$route.params.ex)
  },
  methods: {
    returnEx () {
      let ex = this.$route.params.ex
      this.$router.push({
        path: '/exhibition/mobile/' + ex
      })
    },
    getEx (type) {
      let that = this
      service.getEx(type).then(rep => {
        that.top = rep.data.data.cover
      })
    },
    getOrders () {
      let that = this
      this.loading = true
      service.getOrders(this.$route.params.ex, this.querymobile).then(rep => {
        setTimeout(() => {
          that.loading = false
          that.orders = rep.data.data
        }, 2000)
      })
    },
  }
}
</script>

<style lang="less" scoped>
  .main{
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    .top{
      img {
        width: 100%;
        height: 200px;
      }
    }
  }
</style>
