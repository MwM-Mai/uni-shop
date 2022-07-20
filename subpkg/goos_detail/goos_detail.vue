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
  // 从 vuex 中按需导出 mapState mapMutations 辅助方法
  import { mapState, mapMutations,mapGetters } from "vuex"
  
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
        			info: 0
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
    
    
    // 计算属性
    computed: {
      // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
      // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapState('m_cart', ['']),
      ...mapGetters('m_cart', ['total'])
    },
    
    // 定义有个侦听器器 监听 vuex getters的 total 的变化 改变购物车商品数量的值
    // 普通函数形式 定义的侦听器 在首次加载的时候不会被调用， 因此导致商品详细页首次加载完毕后，不会将商品的总数量显示到商品导航区域的微表上
    // 为了防止上述问题，可使用 对象形式 来定义 watch 侦听器   
    watch: {
      // 普通函数形式
      
      // total(newValue) {
      //   const findResult = this.options.find(x => x.text === '购物车')
        
      //   if(findResult) {
      //     findResult.info = newValue
      //   }
      // }
      
      // 对象形式 定义 total 侦听器 指定一个配置对象
      
      total: {
        // handler 属性用来定义侦听器的 function 处理函数
        handler(newValue) {
          const findResult = this.options.find(x => x.text === '购物车')
          
          if(findResult) {
            findResult.info = newValue
          }
        },
      
        // immediate 属性用来声明此侦听器， 是否在页面首次加载完毕后立即调用
        immediate: true,
      }
    },

    // 生命周期函数
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
        const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
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
        // console.log(e);
        // 判断点击的文字是否为购物车
        if(e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      
      // 商品导航右侧按钮点击事件 处理函数
      buttonClick(e) {
        // console.log(e);
        if(e.content.text === '加入购物车') {
          // 组织商品信息对象
           const goods = {
             goods_id: this.goodsInfo.goods_id,     // 商品的id
             goods_name: this.goodsInfo.goods_name,   // 商品的名字
             goods_price: this.goodsInfo.goods_price,    // 商品的价格
             goods_small_logo: this.goodsInfo.goods_small_logo,   // 商品的图片
             goods_count: 1,      // 商品的数量
             goods_state: true    // 商品的选中状态
           }
           
           // 通过 this. 调用映射过来的 addToCart 方法 把商品信息对象储存到购物车里面
           this.addToCart(goods)
        }
      },
      
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      // ...mapMutations('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapMutations('m_cart', ['addToCart'])
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
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  // .goods-info-container {
  //   padding-bottom: 50px;
  // }
</style>
