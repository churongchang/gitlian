<template>
    <header class="top">
      <div class="form-title-m title">
        {{title}}
      </div>
    </header>
</template>

<script>
export default {
  name: 'success',
  data () {
    return {
      title: undefined
    }
  },
  watch: {
    '$route' (to, from) {
      this.title = this.$route.params.type === '1' ? '考级视频' : '教师认证视频'
    }
  },
  mounted () {
    this.title = this.$route.params.type === '1' ? '考级视频' : '教师认证视频'
  }
}
</script>

<style lang="less" scoped>
 .title{
     padding-top: 8%
 }
</style>
