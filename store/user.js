export default {
  // 开启命名空间
  namespaced: true,
  
  // 数据
  state: () => ({
    // 个人收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    
    token: uni.getStorageSync('token' || ''),
    // 用户的个人信息对象
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 重定向的 Object 对象 {openType, from}  openType 跳转方式 比如 导航页面跳转 switchTab  from 路径 
    // 这个属性就是在跳转到登录界面后 登录成功 重新跳转到原来 的页面 比如 在购物车跳转到 登录界面 登录成功 重新跳转到购物车页面
    redirectInfo: null, 
  }),
  
  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      
      // 2. 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
      this.commit('m_user/saveAddressToStorage')
    },
    
    // 将地址保存到本地储存
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    
    // 更新用户的基本信息
    updateUserInfo(state, userinfo) {
      // console.log(userinfo);
      state.userinfo = userinfo
      // 通过 this.commit() 方法，调用 m_user 模块下的 saveUserInfoToStorage 方法，将 userinfo 对象持久化存储到本地
      this.commit('m_user/saveUserInfoToStorage')
    },
    
    // 将 userinfo 持久化存储到本地
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    
    // 将 请求过来的 token 保存到 vuex 里面
     updateToken(state, token) {
       state.token = token
        // 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
        this.commit('m_user/saveTokenToStorage')
     },
     
     // 将 token 字符串 持久化到本地存储
     saveTokenToStorage(state) {
       // console.log(state.token);
       uni.setStorageSync('token', state.token)
     },
     
     // 修改 重定向 的 对象
     updateRedirectInfo(state, info) {
       state.redirectInfo = info
       // console.log(state.redirectInfo);
     }
  },
  
  // 
  getters: {
    // 拼接 省，市，区，详细地址 的字符串并返回给用户
    addstr(state) {
      if (state.address.userName) {
        return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
      }
    }
  }
}