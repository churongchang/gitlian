<template>
  <div class="main">
      <div class="form-title-m"><br/>
        <span class="theme">
            {{theme}}
        </span>
      </div>
       <el-form class="baseform-m" ref="signform" :rules="rules"  :model="signform" label-position="right" label-width="120px">
          <el-form-item label="姓名" prop="name" size="medium">
            <el-input v-model="signform.name" style="width: 80%;margin-left: -20%"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="age" size="medium" >
            <el-input v-model="signform.age" style="width: 80%;margin-left: -20%"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile" size="medium" >
            <el-input v-model="signform.mobile" style="width: 80%;margin-left: -20%"></el-input>
          </el-form-item>
          <el-form-item v-if="$route.params.id === '100001' || $route.params.id === '100002'" label="专业" prop="discipline" >
            <el-select v-model="signform.discipline" @change="loadFees()" style="width: 80%;margin-left: -20%">
              <el-option v-for="item in disciplines" :value="item.key" :label="item.key" :key="item.key" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="$route.params.id === '100001'" label="周期" prop="cycle" >
            <el-select v-model="signform.cycle" @change="loadFees()"  style="width: 80%;margin-left: -20%" >
              <el-option v-for="item in cycles" :value="item.key" :label="item.value"  :key="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="$route.params.id === '100002'" label="银河普乐级别" prop="yhpy_level" >
            <el-select v-model="signform.yhpy_level" @change="loadFees()" style="width: 80%;margin-left: -20%">
              <el-option v-for="item in levels" :value="item.key" :key="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="totel-m">
            共 ￥{{(total / 100).toFixed(2)}} 元
        </div>
        <div class="button">
            <el-button type="primary" style="width: 60%" size="big" @click="confirm">提交</el-button>
        </div>
  </div>
</template>

<script>
import service from '@/api/chcc'
import wx from 'weixin-js-sdk'
import { Toast } from 'mint-ui'

export default {
  name: 'success',
  data () {
    return {
      theme: undefined,
      signform: {
        name: undefined,
        age: undefined,
        mobile: undefined,
        cycle: undefined,
        discipline: undefined,
        yhpy_level: undefined
      },
      total: 0,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写电话', trigger: 'blur' }
        ]
      },
      cycles: [{
        key: 6,
        value: '6个月'
      }, {
        key: 12,
        value: '12个月'
      }],
      disciplines: [{
        key: '竹笛'
      }, {
        key: '琵琶'
      }, {
        key: '二胡'
      }, {
        key: '古筝'
      }, {
        key: '钢琴'
      }],
      levels: [{
        key: '一级上册'
      }, {
        key: '一级下册'
      }, {
        key: '二级上册'
      }, {
        key: '二级下册'
      }, {
        key: '三级上册'
      }, {
        key: '三级下册'
      }, {
        key: '四级上册'
      }, {
        key: '四级下册'
      }, {
        key: '五级上册'
      }, {
        key: '五级下册'
      }]
    }
  },
  mounted () {
    service.WXConfig().then((res) => {
      wx.config(res.data.data)
    })
    this.loadCourse()
    if (this.$route.params.id === '100003' || this.$route.params.id === '100004') {
      this.loadFees()
    }
  },
  watch: {
    '$route' (to, from) {
      this.loadCourse()
      this.$refs.signform.resetFields()
      this.loadFees()
    }
  },
  methods: {
    loadCourse () {
      service.getCourse(this.$route.params.id).then(res => {
        this.theme = res.data.data.theme
      })
    },
    confirm () {
      if (this.total === 0) {
        Toast({
          message: '请核对报名信息!',
          duration: 5000
        })
        return
      }
      this.$refs.signform.validate(falg => {
        if (falg) {
          const params = new URLSearchParams()
          params.append('courseId', this.$route.params.id)
          params.append('name', this.signform.name)
          params.append('age', this.signform.age)
          params.append('mobile', this.signform.mobile)
          params.append('cycle', this.signform.cycle || '')
          params.append('discipline', this.signform.discipline || '')
          params.append('yhpyLevel', this.signform.yhpy_level || '')
          params.append('fee', this.total)
          service.signSave(params).then(res => {
            const wxpayparams = new URLSearchParams()
            wxpayparams.append('totalFee', res.data.data.totalFee)
            wxpayparams.append('type', service.payType.sign)
            wxpayparams.append('outTradeNo', res.data.data.outTradeNo)
            service.wxPay(wxpayparams).then(payrep => {
              payrep.data.data.success = (payres) => {
                this.$router.push({
                  path: '/signsuccess/' + this.$route.params.id
                })
              }
              payrep.data.data.timestamp = payrep.data.data.timeStamp
              console.log(payrep.data.data.timeStamp)
              wx.chooseWXPay(payrep.data.data)
            })
          })
        }
      })
    },
    loadFees () {
      this.total = 0
      const params = new URLSearchParams()
      params.append('courseId', this.$route.params.id)
      if (this.$route.params.id === '100001') {
        if (!this.signform.discipline || !this.signform.cycle) {
          return
        }
        params.append('discipline', this.signform.discipline)
        params.append('cycle', this.signform.cycle)
      }
      if (this.$route.params.id === '100002') {
        if (!this.signform.discipline || !this.signform.yhpy_level) {
          return
        }
        params.append('discipline', this.signform.discipline)
        params.append('yhpyLevel', this.signform.yhpy_level)
      }
      service.getFees(params).then(res => {
        this.total = res.data.data[0].money
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
