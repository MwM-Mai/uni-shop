<template>
  <view class="my-seach-container" :style="{'background-color': bgColor}">
    <view class="my-seach-box" :style="{'border-radius': redius + 'px'}">
      <!-- uniapp 官方文档 组件的扩展组件可以使用 常用的图标组件 -->
      <!-- 使用 uni-ui 提供的组件 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    data() {
      return {
        
      };
    },
    
    props: {
      // 背景颜色
      bgColor: {
          type: String,
          default: '#C00000'
      },
      // 圆角尺寸
      redius: {
        type: Number,
        default: 18  // px
      }
    },
  }
</script>

<style lang="scss">
.my-seach-container {
  height: 50px;
  // background-color: #C00000;
  display: flex;
  align-items: center;
  padding: 10px 0;
  
  .my-seach-box {
    width: 100%;
    height: 36px;
    background-color: #FFFFFF;
    // border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .placeholder{
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>