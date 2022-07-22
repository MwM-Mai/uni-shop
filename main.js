// 要实现 微信支付 在请求头 添加 token 身份认证的字段
// 原因说明：只有在登录之后才允许调用支付相关的接口，所以必须为有权限的接口添加身份认证的请求头字段



// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from "./store/store.js"

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

// 挂载到顶级的对象之上 uniapp 顶级对象是 uni
uni.$http = $http

// 请求的根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 如果在每次请求拦截之前显示 loading 效果 请求之后隐藏 loading 效果 就要使用 拦截器
// 请求拦截器 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  // console.log(options);
  // 例如显示loading
  uni.showLoading({
      title: '数据加载中...',
    })
  
  // console.log(store.state.m_user.token);
  
  //  添加 token 身份认证
  // 判断请求的是否为有权限的 API 接口
  // 由于 登录界面的 请求接口 挂了  
  // 所有现在 为了实现这个功能 判断 home 的接口
  // if(options.url.indexOf('/my/') !== -1) {
  if(options.url.indexOf('/home/') !== -1) {
    // 为请求头添加 身份认证 字段 就是 token 的值
    options.header = {
      Authorization: store.state.m_user.token
    }
    // 字段的值可以直接从 vuex 中进行获取
  }
}

// 响应拦截器 请求完成之后做一些事情
$http.afterRequest = function () {
  // 隐藏loading效果
  uni.hideLoading()
}

// 封装显示消息的提示方法
uni.$showMsg = function (title = '数据加载失败!', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif