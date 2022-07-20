<template>
  <view>
    <!-- 选择收货地址 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btn-choose-address" @click="chooseArrdess">选择收获地址+</button>
    </view>

    <!-- 渲染收获地址信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseArrdess">
      <view class="row1">
        <!-- 左侧收货人 -->
        <view class="row1-left">
          <view class="username">收货人：{{address.userName}}</view>
        </view>
        <!-- 右侧电话 -->
        <view class="row1-right">
          <view class="phone">电话:{{address.telNumber}}</view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <!-- 地址 -->
      <view class="row2">
        <view class="row2-left-left">收货地址：</view>
        <view class="row2-right">{{addstr}}</view>
      </view>
    </view>

    <!-- 底部边框 -->
    <view class="address-bottom-border"></view>
  </view>
</template>

<script>
  // 导入 vuex user模块的辅助函数
  import {mapState, mapMutations, mapGetters} from "vuex"
  
  export default {
    name: "my-address",
    data() {
      return {
        // address: {}
      };
    },

    methods: {
      ...mapMutations('m_user', ['updateAddress']),
      
      // 选择收获地址
      async chooseArrdess() {
        // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
        //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
        const [err, res] = await uni.chooseAddress().catch(err => err)
        // console.log(res);

        // 2. 用户成功的选择了收货地址 
        if(err === null && res.errMsg === 'chooseAddress:ok') {
          // this.address = res
          // console.log(res);
          this.updateAddress(res)
        }
      }
    },
    
    
    computed: {
      ...mapState('m_user', ['address']), 
      ...mapGetters('m_user', ['addstr'])
      
    }
  }
</script>

<style lang="scss">
  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .address-bottom-border {
    height: 8px;
    background-color: #efefef;
  }

  .address-info-box {
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;

    .row1 {
      display: flex;
      justify-content: space-between;


      .row1-right {
        display: flex;
        justify-content: space-between;

      }
    }

    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;


      .row2-left-left {
        white-space: nowrap; // 文本不换行
      }

    }
  }
</style>
