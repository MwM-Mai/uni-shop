// tabbar 购物车显示的商品数量总数 因为在每个 tabbar 的页面显示的时候都需要显示 购物车徽标的 数量 
// 所有选择混入的方法 混入到tabbar 每项的页面进行挂载 即可实现 

import {mapGetters} from "vuex"

export default {
  
  
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  
  methods: {
    setBadge() {
      // 给TabBar 设置徽标
      uni.setTabBarBadge({
        index:2,  // tabbar 索引号
        text: this.total + ''          // 文本 必须是 字符串型
      })
    },
  },
  
  // 生命周期函数 页面显示的时候调用
  onShow() {
    // 调用方法
    this.setBadge()
  },
  
  // 侦听器 监听购物车数量的变化 一但变化 调用 this.setBadge() 更新 tabbar 的微标
  // 如果不监听 删除商品 + - 商品的时候 无法实时 的更改 tabbar 微标的值
  watch: {
    // 只要监听到total的数值发生了变化 立即调用 this.setBadge() 方法重新计算 total 的数量
    total() {
      this.setBadge()
    }
  }
  
}