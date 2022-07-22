<template>
  <view class="my-userinfo-container">
    <!-- 头像和昵称区域 -->
    <view class="top-box">
      <image :src="userinfo.avatarUrl" class="avater"></image>
      <view class="nikename">{{userinfo.nickName}}</view>
    </view>
    <!-- 面板区域 -->
    <view class="panle-list">
      <!-- 第一个面板 -->
      <view class="panle">
        <view class="panle-body">
          <view class="panle-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panle-item">
            <text>14</text>
            <text>收藏的商品</text>
          </view>
          <view class="panle-item">
            <text>18</text>
            <text>关注的商品</text>
          </view>
          <view class="panle-item">
            <text>84</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <!-- 第二个面板 -->
      <view class="panle">
        <view class="panle-tital">
          我的订单
        </view>
        <view class="panle-body">
          <view class="panle-item">
            <image src="/static/images/my/order-fill.png" class="icon"></image>
            <text class="item-text">待付款</text>
          </view>
          <view class="panle-item">
            <image src="/static/images/my/land transportation.png" class="icon"></image>
            <text class="item-text">待收货</text>
          </view>
          <view class="panle-item">
            <image src="/static/images/my/退款.png" class="icon"></image>
            <text class="item-text">退货/退款</text>
          </view>
          <view class="panle-item">
            <image src="/static/images/my/订单.png" class="icon"></image>
            <text class="item-text">全部订单</text>
          </view>
        </view>
      </view>
      <!-- 第三个面板 -->
      <view class="panle">
        <view class="panle-item-list">
          <view class=""><text>收货地址</text></view>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panle-item-list">
          <text>联系客服</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panle-item-list" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {mapState, mapMutations} from "vuex"
  
  export default {
    name:"my-userinfo",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('m_user', ['userinfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress', 'updateUserInfo', 'updateToken']),
      
      // 点击退出登录
      async logout() {
        // console.log(1);
        await uni.showModal({
          title: '提示',
          content:'确认退出登录吗?'
        }).then(res => {
          if(res[1] && res[1].confirm) {
            // 清除 用户信息数据 
            // 清除 vuex 的 token 和 userinfo 和 address
            this.updateAddress({})  // 传入一个空对象
            this.updateUserInfo({})  // 传入一个空对象
            this.updateToken('')     // 传入一个空字符串
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-userinfo-container {
    width: 100%;
    height: 100%;
    background-color: #f4f4f4;
   
    .top-box {
      height: 200px;
      background-color: #C00000;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column; 
      
      .avater {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        border: 2px solid white;
        box-shadow: 0 1px 5px black;
        
      }
      
      .nikename {
        font-size: 16px;
        color: white;
        font-weight: bold;
        margin-top: 10px;
      }
    }
    
    .panle-list {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 0 10px;
      position: relative;
      top: -10px;
      
      .panle {
        width: 100%;
        background-color: white;
        border-radius: 3px;
        margin-bottom: 8px;
        padding-left: 10px;
        font-size: 15px;
        
        .panle-body {
          display: flex;
          justify-content: center;
          align-items: center;
          .panle-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            padding: 5px 10px;
            
             .icon {
                width: 35px;
                height: 35px;
                padding: 5px 14px;
              }
          }
          
        }
        
        .panle-tital {
          line-height: 45px;
          border-bottom: 1px solid #f4f4f4;
        }
        
        .panle-item-list {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          padding: 0 10px;
          line-height: 45px;
        }
      }
      
    }
  }
  
    
</style>