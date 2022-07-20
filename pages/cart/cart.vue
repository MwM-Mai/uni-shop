<template>
  <view>
    <view class="cart" v-if="cart.length !== 0">
      <!-- 收货地址区域 -->
      <my-address></my-address>
    
      <!-- 商品列表的标题区域 -->
      <view class="cart-title">
        <!-- 左侧图标 -->
        <uni-icons type="shop" size="18"></uni-icons>
        <!-- 右侧文本 -->
        <text class="cart-title-text">购物车</text>
      </view>
      
      <!-- 左滑删除效果 uni 提供的扩展组件 -->
      <uni-swipe-action>
        <!-- 循环渲染购物车中的商品信息 -->
        <block class="" v-for="(item, index) in cart" :key="index">
          <uni-swipe-action-item :right-options="options" @click="swiperItemClickHandler(item)">
            <my-goods :item="item" :showRadio="true" @radio-change="radioChangeHanler" :showNum="true" @num-change="numChangeHandler"></my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
        
        <!-- 使用自定义的结算组件 -->
        <my-settle></my-settle>
    </view>
    
    <!-- 空白购物车的区域 -->
    <view class="empty-cart" v-else>
      <image src="../../static/images/cart/cart-Empty-fill.png" class="empty-img"></image>
      <text class="empty-text">空空如也~</text>
    </view>
  </view>
</template>

<script>
  // 导入混入 显示购物车商品数量总数的 徽标
  import badgeMix from "@/mixins/tabbar-badge.js"
  // 导入 vuex 的购物车数据 和 方法
  import { mapState, mapMutations } from "vuex"
  
  export default {
    // 挂载混入
    mixins: [badgeMix],
    
    // 数据
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#C00000'
            
          }
        }]
      };
    },
    
    
    //计算属性 
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    
    // 方法 
    methods: {
      // 挂载 mutation 方法
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'updateGoods']),
      
      // 监听 自定义组件 my-goods 的 goods_state 变化 调用 vuex的 updateGoodsState 方法 是否勾选
      radioChangeHanler(e) {
        // console.log(e);
        // 因为要修改 vuex 的值 所有只能调用 mutation 的方法
        this.updateGoodsState(e)
      },
      
      // 监听 自定义组件 my-goods 的 goods_state 变化 调用 vuex 的  方法 改变 该商品数量变化 
      numChangeHandler(e) {
        this.updateGoodsCount(e)
      },
      
      // 监听是否点击删除按钮
      swiperItemClickHandler(item) {
        // console.log(item);
        this.updateGoods(item)
      },
    },
    
    // 生命周期函数 页面显示的时候调用
    onShow() {

    }
  }
</script>

<style lang="scss">
.cart {
  padding-bottom: 50px;
}
  
.cart-title {
  height: 40px;
  display: flex;
  align-items: center; 
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  
  .cart-title-text {
    font-size: 14px;
    margin-left: 10px;
  }
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 240rpx;
  .empty-img {
    width: 90px;
    height: 90px;
  }
  
  .empty-text {
    font-size: 12px;
    color: gray;
  }
  
}

</style>
