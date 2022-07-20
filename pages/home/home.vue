<template>
  <view>
    <!-- 搜索框 实现吸顶效果 需要给自定义组件添加应该父盒子-->
    <view class="search-box">
      <my-search @click.native="gotoSearch"></my-search>
    </view>
    <!-- 轮播图的区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, index) in swiperList" :key="index">
        <navigator :url="`/subpkg/goos_detail/goos_detail?goos_id=${item.goods_id}`" class="swiper-item">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    
    <!-- 分类导航区域 -->
    <view class="nav-lsit">
      <view v-for="(item, index) in navList" :key="index" class="nav-item" @click="navClickHandler(item)"> 
        <img :src="item.image_src" class="nav-img">
      </view>
    </view>
    
    <!-- 楼层区域 -->
    <!-- 楼层容器 -->
    <view class="floor-list">
      <!-- 每一个楼层的item项 -->
      <view class="floor-item" v-for="(item, index) in floorList" :key="index">
        <!-- 楼层的标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层的图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片 mode="widthFix" 高度自适应-->
          <navigator class="letf-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          <!-- 右侧四个小图片 -->
          <view  class="right-img-box">
            <view  v-for="(item2, index2) in item.product_list" :key="index2">
              <navigator v-if="index2 !== 0" :url="item2.url">
                <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
              </navigator>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  // 导入混入 显示购物车商品数量总数的 徽标
  import badgeMix from "@/mixins/tabbar-badge.js"
  
  export default {
    // 挂载混入
    mixins: [badgeMix],
    
    data() {
      return {
        // 1. 轮播图的数据列表
        swiperList: [],
        // 2. 分类导航数据列表
        navList: [],
        // 3. 楼层数据列表
        floorList: [],
      };
    },
    // 生命周期函数 挂载
    onLoad() {
      // 调用方法获取轮播图数据
      this.getSwiperList() 
      // 调用方法获取分类导航数据
      this.getNavList()
      // 调用方法获取楼层数据
      this.getFloorList()
    },
    methods: {
      // 获取轮播图数据
      async getSwiperList() {
        const {data: res} = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        
        // 请求成功
         this.swiperList = res.message
         uni.$showMsg(res.meta.msg)
      },
      
      // 获取分类导航数据
      async getNavList() {
        const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 请求成功 
        this.navList = res.message
        uni.$showMsg(res.meta.msg)
      },
      
      //  获取楼层数据
      async getFloorList() {
        const {data: res} = await uni.$http.get('/api/public/v1/home/floordata')
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 请求成功 
        // 对数据进行处理 切换页面的路径不对
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goos_list/goos_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      
      
      
      
      
      // 点击分类导航页面跳转
      navClickHandler(item) {
        if(item.name == '分类') {
          uni.switchTab({
            url: "/pages/cate/cate"
          })
        }
      },
      
      // 点击搜索框跳转搜索页面
      gotoSearch() {
        uni.navigateTo({
          url: "/subpkg/search/search"
        })
      }
    }
  }
</script>

<style lang="scss">
swiper{ 
  height: 330rpx;
  .swiper-item,
   image {
     width: 100%;
     height: 100%;
   }
}

.nav-lsit {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

.floor-title {
  width: 100%;
  height: 60rpx;
}

.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}

.search-box {
  // 固定定位 设置定位为吸顶效果
  position: sticky;
  // 吸顶位置 顶部
  top: 0;
  // 提高层级 层级为最上层 9999
  z-index: 9999;
}
</style>
