// 1. 导入Vue 和 Vuex
import Vue from "vue"
import Vuex from "vuex"
import moduleCart from "@/store/cart.js"
import moduleUser from "@/store/user.js"

// 2. 将 vuex 安装为 vue 的插件
 Vue.use(Vuex)
 
 // 3. 创建实例
 const store = new Vuex.Store ({
   // TODO：挂载 store 模块
   modules: {
     // 2. 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
     //    购物车模块中 cart 数组的访问路径是 m_cart/cart
     m_cart: moduleCart,
     m_user: moduleUser
   }
 })
 
 // 4. 导出
 export default store