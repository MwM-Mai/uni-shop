export default {
  namespaced: true,
  
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),
  
  // 模块的 mutations 方法
  mutations: {
    // 传两个参数 state 和 商品
    addToCart(state, goods) {
      // 判断 商品是否存在 cart 里面
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // console.log(findResult);
      
      // 不存在 添加该商品
      if(!findResult) {
        state.cart.push(goods)
      } else {
        // 存在 该商品 + 1
        findResult.goods_count ++
      }
      
      // this.commit 修改 mutations 的数据
      // 调用 m_cart 模块的 saveToStorage 方法 将购物车数据本地储存
      this.commit('m_cart/saveToStorage', state)
      // console.log(state);
    },
    
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    
    // 更新购物车商品是否被选中的状态
    updateGoodsState(state,e) {
      // 遍历数组判断 点击该商品的id 和 购物车商品的id是否一致
      const findResult= state.cart.find(x => x.goods_id === e.goods_id)
      
      // id一致后 通过改变goods_state的值 显示是否选中状态
      if(findResult) {
        findResult.goods_state = !findResult.goods_state
      }
      
      // 修改过后进行本地缓存
      this.commit('m_cart/saveToStorage', state)
    },
    
    // 更新购物车商品的数量
    updateGoodsCount(state, goods) {
      // 遍历数组判断 点击该商品的id 和 购物车商品的id是否一致
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // id一致后 通过改变goods_count的值 修改商品的数量
       if(findResult) {
         findResult.goods_count = goods.goods_count
         
         // 修改后进行本地储存
         this.commit('m_cart/saveToStorage', state)
       }
    },
    
    // 如果点击删除按钮 删除该商品
    updateGoods(state, goods) {
      // 遍历数组 过滤掉 点击该商品的id 和 购物车商品的id是否一致
      state.cart = state.cart.filter(x => x.goods_id !== goods.goods_id)
     
      // 修改后进行本地储存
      this.commit('m_cart/saveToStorage', state)

    },
    
    // 更新所有商品的勾选状态 点击全选按钮 调用这个函数 使商品勾选状态全选或者全不选
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      // 修改后进行本地储存
      this.commit('m_cart/saveToStorage', state)
    }
  },
  
  // 模块的 getters 属性
  getters: {
    // tabbar 的微标数量 就是 商品所有数量 包括不勾选的
    total(state) {
      // let c = 0
      // state.cart.forEach(x => c += x.goods_count)
      // return c
      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    
    // 计算购买的总数量 
    checKoutCount(state) {
      // 过滤掉所有不勾选的商品 计算勾选商品的数量
      return state.cart.filter(x => x.goods_state).reduce((total, item) =>  total += item.goods_count, 0)
    },
    
    // 已勾选的商品的总价
    checkedGoodsAmount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter(x => x.goods_state)
                       .reduce((price, item) => price += item.goods_count * item.goods_price, 0)
                       .toFixed(2)
    }
  },
  
  
}