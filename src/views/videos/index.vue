<template>
  <div class="main">
    <top class="top"></top>
    <div class="videos">
      <pull-to :bottom-load-method="loadMore" :is-top-bounce="false">
        <div class="video" v-for="item in videos" :key="item.id" @click="toVideo(item)">
            <div class="title">{{item.title}}</div>
            <div class="price">￥{{item.price / 100}}</div>
            <div class="state">{{item.state === 0 ? '未购买' : '已购买'}}</div>
        </div>
      </pull-to>
    </div>
  </div>
</template>
<script>
import PullTo from 'vue-pull-to'
import service from '@/api/chcc'
import top from './top.vue'
export default {
  name: 'success',
  components: {
    PullTo, top
  },
  data () {
    return {
      videos: [],
      page: 1,
      size: 10,
      buyVideos: [],
      loadDone: false
    }
  },
  watch: {
    '$route' (to, from) {
      this.videos = []
      this.page = 1
      this.size = 10
      this.buyVideos = []
      this.loadDone = false
      this.loadBuyVideos(this.loadVideos)
    }
  },
  mounted () {
    this.loadBuyVideos(this.loadVideos)
  },
  methods: {
    loadBuyVideos (callback) {
      const params = new URLSearchParams()
      params.append('type', this.$route.params.type)
      service.getBuyVideos(params).then(res => {
        this.buyVideos = res.data.data
        callback()
      })
    },
    loadVideos () {
      this.videos = []
      const that = this
      const params = new URLSearchParams()
      params.append('type', this.$route.params.type)
      params.append('page', this.page)
      params.append('size', this.size)
      service.getVideos(params).then(res => {
        res.data.data.forEach(item => {
          item.state = 0
          that.buyVideos.forEach(buy => {
            if (buy.videoId === item.id) {
              item.state = 1
            }
          })
        })
        this.videos = res.data.data
        this.loadDone = res.data.page.isLastPage
      })
    },
    loadMore (loaded) {
      if (this.loadDone) {
        loaded('done')
        return
      }
      const that = this
      this.page = this.page + 1
      const params = new URLSearchParams()
      params.append('type', this.$route.params.type)
      params.append('page', this.page)
      params.append('size', this.size)
      service.getVideos(params).then(res => {
        res.data.data.forEach(item => {
          item.state = 0
          that.buyVideos.forEach(buy => {
            if (buy.videoId === item.id) {
              item.state = 1
            }
          })
        })
        that.videos = that.videos.concat(res.data.data)
        that.$nextTick(() => {
          loaded('done')
        })
        this.loadDone = res.data.page.isLastPage
      })
    },
    toVideo (item) {
      this.$router.push({
        path: '/' + this.$route.params.type + '/video/' + item.id,
        query: {
          video: JSON.stringify(item)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .main{
    height: 100%;
    .top{
      background: white;
      position: fixed;
      top: 0;
      text-align: center;
      width: 100%;
      z-index: 500;
      height: 90px
    }
    .videos{
      position: fixed;
      width: 100%;
      left: 0;
      top: 100px;
      height: 80vh;
      .video{
        margin-right: auto;
        margin-left: auto;
        width: 90%;
        height: 5em;
        border-bottom: 1px #eee solid;
        margin-bottom: 1em;
        .title{
          width: 90%;
          text-align: left;
          font-size: 1.2em;
          font-weight: 300;
          color: gray;
          margin-left: 10%
        }
        .price{
          display: inline-block;
          text-align: left;
          font-size: 1.2em;
          font-weight: 500;
          color:tomato;
          margin-left: 45%;
          margin-top:5%
        }
        .state{
          display: inline-block;
          text-align: left;
          font-size: 0.9em;
          font-weight: 400;
          color:tomato;
          margin-left: 5%;
        }
      }
    }
  }
</style>
