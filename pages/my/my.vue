<template>
  <view class="my-container">
    <my-login v-if="!token"></my-login>
    
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  // 导入混入 显示购物车商品数量总数的 徽标
  import badgeMix from "@/mixins/tabbar-badge.js"
  
  import {mapState} from "vuex"
  
  export default {
    // 挂载混入
    mixins: [badgeMix],
    
    data() {
      return {
        
      }
    },
    methods: {
      
    },
    computed: {
      ...mapState('m_user', ['token'])
    }
  }
</script>

<style>
  /* 每一个页面都有一个 page 根节点 要设置页面高度 选择 page 节点 对应的容器 */
  page, .my-container {
    height: 100%;
    width: 100%;
  }
</style>
