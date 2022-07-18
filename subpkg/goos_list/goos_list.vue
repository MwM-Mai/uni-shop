<template>
  <view>
    <!-- 商品列表 -->
    <view class="goods-list">
      <view v-for="(item, index) in goodsList" :key="index" @click="getDetail(item)">
        <my-goods :item='item'></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    // 数据
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10,
          
        },
        // 商品列表数据
        goodsList: [],
        // 商品列表数据总量
        total: 0,
        // 节流阀
        isLoding: false,
      };
    },
    
    
    // 生命周期函数
    // options 页面跳转之后的参数
    onLoad(options) {
      // console.log(options);
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      
      // 调用获取商品列表数据的方法
      this.getGoodsList()
    },
    
    
    // 触底事件
     
     onReachBottom() {
      if(!this.isLoding) {
        if(this.queryObj.pagenum * this.queryObj.pagesize < this.total) {
          // 商品页面 + 1
          this.queryObj.pagenum++
          // 重新加载数据
          this.getGoodsList()
        } else {
          uni.$showMsg('数据加载完毕')
        }
        
      }
     },
     
     
    // 下拉刷新事件
      
    onPullDownRefresh() {
      // 重置所有相关数据
      this.queryObj.pagenum = 1
      this.goodsList = []
      this.total = 0
      this.isLoding = false
      
      // 重新请求数据 关闭当前页面的刷新效果
      this.getGoodsList(() => uni.stopPullDownRefresh())
    },
    
    
    // 方法
    
    methods: {
      // 请求商品列表数据
      async getGoodsList(cb) {
        // 节流阀开启
        this.isLoding = true
        
        const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        
        // 请求完成后 关闭节流阀
        this.isLoding = false
        
        // 数据请求完毕之后调用 cb 回调函数 停止下拉刷新效果
        cb && cb()
        
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        // console.log(res);
        
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      
      
      // 点击跳转到详情页
      getDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goos_detail/goos_detail?goods_id=' + item.goods_id
        })
      }
    },
      
      
  }
</script>

<style lang="scss">

</style>
