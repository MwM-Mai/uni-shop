export default {
  // 开启命名空间
  namespaced: true,
  
  // 数据
  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}')
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