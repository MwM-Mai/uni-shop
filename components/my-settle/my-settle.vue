<template>
  <view>
    <view class="my-settel-container">
      <!-- 全选 -->
      <label class="radio" @click="changeAllState">
        <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
      </label>
      <!-- 合计 -->
      <view class="amount-box">
        合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
      </view>
      <!-- 结算 -->
      <view class="btn-settle">
        <text>结算({{checKoutCount}})</text>
      </view>
    </view>
  </view>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex"
  
  export default {
    name:"my-settel",
    data() {
      return {
        
      };
    },
    
    computed: {
      ...mapGetters('m_cart', ['checKoutCount', 'total', 'checkedGoodsAmount']),
      
      // 判断 勾选的数量 和 未勾选的数量 是否一样 如果一样 全选的勾选按钮为 true
      isFullCheck() {
        return this.checKoutCount === this.total
      }
    },
    
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      // 点击全选或者全不选
      changeAllState() {
        // console.log(!this.isFullCheck);
        // 调用 vuex 里面的 方法 使按下全选按钮时 改变所有商品的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      }
    }
  }
</script>

<style lang="scss">
.my-settel-container {
  height: 50px;
  width: 100% ;
  position: fixed;   // 固定定位
  bottom: 0;
  left: 0;
  background-color: white;
  z-index: 999999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  vertical-align: middle;
  box-shadow: 0 0 25px #efefef;
  
  .radio {
    
  }
  
  .amount-box {
    
    .amount {
      color: #C00000;
      font-weight: bold;
    }
  }
  
  .btn-settle {
    display: flex;
    background-color: #C00000;
    color: white;
    line-height: 50px;
    padding: 0 10px;
    min-width: 100px;  // 最小宽度
  }
}


</style>