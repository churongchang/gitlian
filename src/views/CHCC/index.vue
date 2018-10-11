<template>
  <div class="main">
    <div class="top">
      <img :src="top"/>
    </div>
    <div class="form">
      <div class="base-form">
          <div class="form-title">填写资料 预订酒店<br/>
            <span class="notice">
            {{explain}}
          </span>
        </div>
        <el-form class="baseform" ref="baseform" :rules="baserules" :model="baseform" label-width="80px">
          <el-form-item label="姓　　名" prop="name" size="medium">
            <el-input v-model="baseform.name" style="width: 60%;margin-left: -40%"></el-input>
          </el-form-item>
          <el-form-item label="单位名称" prop="unitname" size="medium">
            <el-input v-model="baseform.unitname" style="width: 60%;margin-left: -40%"></el-input>
          </el-form-item>
          <el-form-item label="电　　话" prop="mobile" size="medium">
            <el-input v-model="baseform.mobile" style="width: 60%;margin-left: -40%"></el-input>
          </el-form-item>
        </el-form>
        <el-form class="hotelform" ref="hotelform" :rules="hotelrules"  :model="baseform" label-position="right" label-width="80px">
           <el-form-item label="酒店名称" prop="hotel" :inline-message="true" style="margin-left: 12%">
            <el-select v-model="baseform.hotel" filterable @change="loadRoomTypes($event)" style="margin-left: -50%; width: 50%">
              <el-option v-for="hotel in hotels" :value="hotel.id" :label="hotel.name" :key="hotel.id" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-for="(roomType, index) in baseform.roomTypes" :key="roomType.id" style="margin-left: -8%">
            <el-checkbox :disabled="baseform.roomTypes[index].stock === 0" :true-label="roomType.id" :false-label="-1" :key="roomType.id" border @change="changeRoomType($event,roomType)">{{roomType.room_type_text +'('+ (roomType.price/100) +'￥/晚,剩余'+ baseform.roomTypes[index].stock +'间)' }}</el-checkbox>
            <el-input-number style="width: 125px;" :disabled="baseform.roomTypes[index].disabled" v-model="baseform.roomTypes[index].count" :min="0" :max="baseform.roomTypes[index].stock"></el-input-number>
          </el-form-item>
          <el-form-item label="入住时间" prop="checkInDate" :inline-message="true" style="margin-left: 12%">
            <el-select v-model="baseform.checkInDate"  style="margin-left: -50%; width: 50%">
              <el-option v-for="checkInDate in checkInDates" :value="checkInDate" :key="checkInDate" border ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="离店时间" prop="checkOutDate" :inline-message="true" style="margin-left: 12%">
            <el-select v-model="baseform.checkOutDate" style="margin-left: -50%; width: 50%">
              <el-option v-for="checkOutDate in checkOutDates" :value="checkOutDate" :key="checkOutDate" border ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="totel">
            共 ￥{{(totel / 100).toFixed(2)}} 元
        </div>
      </div>
      <div class="hotel-info">
        <div class="form-title">
          酒店信息<br/>
        </div>
        <el-carousel class="carousel" height="30em" >
          <el-carousel-item v-for="item in imgs" :key="item">
           <img :src="item"/>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="charge-info">
        <div class="form-title">
          温馨提示<br/>
        </div>
        <div class="content" v-html="extra">
          {{extra}}}
        </div>
      </div>
    </div>
    <div class="button">
      <el-button type="primary" size="big" @click="confirm">提交</el-button>
      <el-button type="warning" size="big" @click="formreset">重置</el-button>
      <el-button type="success" size="big" @click="show = true">订单查询</el-button>
    </div>

    <el-dialog title="订单查询" :visible.sync="show" width="60%">
      <div class="filter">
        <el-input class="filter-item" style="width: 200px" v-model="querymobile" placeholder="请输入手机号"></el-input>
        <el-button class="filter-item" type="primary" @click="getOrders">查询</el-button>
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

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="show = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import service from '@/api/chcc'
import { Message } from 'element-ui'

export default {
  name: 'index',
  data () {
    return {
      baseform: {
        id: '',
        name: '',
        mobile: '',
        unitname: '',
        hotel: undefined,
        roomTypes: [],
        checkInDate: '',
        checkOutDate: ''
      },
      checkInDates: [],
      checkOutDates: [],
      baserules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        unitname: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      hotelrules: {
        hotel: [
          { required: true, message: '请选择酒店', trigger: 'blur' }
        ],
        checkInDate: [
          { required: true, message: '请选择入住时间', trigger: 'blur' }
        ],
        checkOutDate: [
          { required: true, message: '请选择入住时间', trigger: 'blur' }
        ]
      },
      roomTypes: [],
      explain: undefined,
      extra: undefined,
      top: undefined,
      imgs: [],
      hotels: [],
      show: false,
      querymobile: undefined,
      loading: false,
      orders: []
    }
  },
  mounted () {
    if (!this.isPc()) {
      this.$router.push({
        path: '/exhibition/mobile/' + this.$route.params.ex
      })
    }
    this.init(this.$route.params.ex)
  },
  computed: {
    days () {
      let start = moment(this.baseform.checkInDate)
      let end = moment(this.baseform.checkOutDate)
      return end.diff(start, 'days')
    },
    totel () {
      let totel = 0
      this.baseform.roomTypes.forEach((item) => {
        totel += item.count * item.price
      })
      return this.days > 0 ? (totel * this.days) : 0
    }
  },
  methods: {
    isPc () {
      var userAgentInfo = navigator.userAgent
      var Agents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod']
      var flag = true
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false
          break
        }
      }
      return flag
    },
    init (type) {
      let that = this
      that.baseform.name = localStorage.getItem('name') ? localStorage.getItem('name') : ''
      that.baseform.mobile = localStorage.getItem('mobile') ? localStorage.getItem('mobile') : ''
      that.baseform.unitname = localStorage.getItem('unitname') ? localStorage.getItem('unitname') : ''
      service.getEx(type).then(rep => {
        that.baseform.id = rep.data.data.id
        that.hotels = rep.data.data.hotels
        that.checkInDates = rep.data.data.check_at
        that.checkOutDates = rep.data.data.leave_at
        that.top = rep.data.data.cover
        that.explain = rep.data.data.explain
        that.extra = rep.data.data.extra
        rep.data.data.imgs.forEach((item) => {
          that.imgs.push(item.src)
        })
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
    loadRoomTypes (val) {
      this.baseform.roomTypes = []
      this.hotels.forEach((item) => {
        if (item.id === val) {
          item.room_types.forEach((item) => {
            this.baseform.roomTypes.push({
              ...item,
              disabled: true,
              count: 0
            })
          })
        }
      })
    },
    changeRoomType (val, roomType) {
      roomType.disabled = !(val > 0 && roomType.stock > 0)
      if (val < 0) {
        roomType.count = 0
      }
    },
    formreset () {
      this.baseform = {
        name: '',
        mobile: '',
        unitname: '',
        hotel: undefined,
        roomTypes: [],
        dateRange: []
      }
    },
    confirm () {
      let that = this
      localStorage.setItem('name', that.baseform.name)
      localStorage.setItem('mobile', that.baseform.mobile)
      localStorage.setItem('unitname', that.baseform.unitname)
      that.$refs['baseform'].validate((basevalidate) => {
        if (basevalidate) {
          that.$refs['hotelform'].validate((hotelform) => {
            if (hotelform) {
              if (that.total < 1) {
                Message.warning('请调整预定信息')
              }
              let selectRoomType = []
              that.baseform.roomTypes.forEach(item => {
                if (item.count > 0) {
                  selectRoomType.push({
                    id: item.id,
                    count: item.count
                  })
                }
              })

              let params = {
                exhibition_id: that.baseform.id,
                username: that.baseform.name,
                user_mobile: that.baseform.mobile,
                company: that.baseform.unitname,
                hotel_id: that.baseform.hotel,
                amount: that.totel,
                check_at: that.baseform.checkInDate,
                leave_at: that.baseform.checkOutDate,
                room_id: JSON.stringify(selectRoomType)
              }

              service.orderConfirm(params).then(rep => {
                location.href = service.payUrl + '/v1/alipay/web' + '?order_id=' + rep.data.data.id +
                  '&return_url=' + encodeURIComponent(service.returnUrl + '/' + this.$route.params.ex) +
                  '&subject=' + '预定酒店' +
                  '&amount=' + that.totel +
                  '&body=' + rep.data.data.id
              })
            }
          })
        }
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
    .top{
      img {
        width: 50em;
        height: 20em;
      }
    }
  }
</style>
