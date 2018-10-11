<template>
  <div class="main">
    <div class="charge-info">
      <div class="success">
        <span class="title">报名成功</span><br/>
        <br/>
      </div>
      <div class="button">
        <el-button type="success" size="big" @click="returnEx">返回报名页</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'success',
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    returnEx () {
      let id = this.$route.params.id
      this.$router.push({
        path: '/sign/' + id
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
    .success{
      padding-top: 20%;
      font-size: 1.5em;
      font-weight: 200;
      color: #E41313;
    }
  }
</style>
