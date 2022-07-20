<template>
  <view>
    My
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
        
      }
    },
    methods: {
      
    }
  }
</script>

<style>

</style>
