<template>
  <view v-if="goodsInfo.goods_name" class="goods-info-container"> <!-- 在请求数据回来之前的时候 goodsInfo 数据为 {} 所有 价格为 undefined 所有要判断 是否数据存在 解决价格闪烁的问题 -->
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
      <swiper-item v-for="(item, index) in goodsInfo.pics" :key="index">
        <image :src="item.pics_big" @click="preview(index)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-infp-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goodsInfo.goods_price}}</view>
      <!-- 商品主题信息 -->
      <view class="goods-info-body">
        <!-- 商品的名字 -->
        <view class="goods-name">{{goodsInfo.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费区域 -->
      <view class="yf">快递：免运费</view>
    </view>
    <!-- 详细信息 使用 uniapp 组件 rich-text 把 html的字符串渲染成Ui结构 -->
    <rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
    <!-- 商品导航 利用 uniapp 自带组件 -->
    <uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick"  />
  </view>
</template>

<script>
  export default {
    // 数据
    data() {
      return {
        goodsInfo: {},
        
        // 商品导航数据
        options: [{
        			icon: 'shop',
        			text: '店铺',
        			infoBackgroundColor:'#007aff',
        			infoColor:"red"
        		}, {
        			icon: 'cart',
        			text: '购物车',
        			info: 2
        		}],
        	    buttonGroup: [{
        	      text: '加入购物车',
        	      backgroundColor: '#ff0000',
        	      color: '#fff'
        	    },
        	    {
        	      text: '立即购买',
        	      backgroundColor: '#ffa200',
        	      color: '#fff'
        	    }
        	    ]
      };
    },

    // 声明周期函数
    onLoad(options) {
      // 获取商品 Id
      const goods_id = options.goods_id
      // 调用请求商品详情数据的方法
      this.getGoodsDetail(goods_id)
    },

    // 方法
    methods: {
      // 请求商品详情数据的方法
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        
        // // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题 将 webp 的后缀名替换为 jpg 的后缀名 解决移动端 无法识别 .webp 后缀的图片
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
        
        this.goodsInfo = res.message
      },
      
      
      
      // 点击放大轮播图的图片 实现轮播图预览效果
      preview(index) {
        // 调用 uni.previewimage() 方法预览图片 
        uni.previewImage({
          current: index,
          urls: this.goodsInfo.pics.map(x => x.pics_big)
        })
      },
      
      // 点击跳转到购物车
      onClick(e) {
        console.log(e);
        if(e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      }
    },

  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;
    

    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .goods-infp-box {
    padding: 10px;
    padding-right: 0;
    
    .price {
      color: #C00000;
      font-size: 18px;
      margin: 10px 0;
    }
    
    
    .goods-info-body {
      display: flex;
      justify-content: space-between;
      
      .goods-name {
        font-size: 13px;
        margin-right: 10px;
      }
      
      
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: solid 1px #efefef;
        color: gray;
      }
    }
    
    .yf {
      font-size: 12px;
      color: gray;
      margin: 10px 0;
    }
  }
  .uni-goods-nav {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  // .goods-info-container {
  //   padding-bottom: 50px;
  // }
</style>
