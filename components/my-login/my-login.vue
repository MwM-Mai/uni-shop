<template>
  <view class="login-container">
    <!-- uniapp 的扩展组件 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- open-type="getUserInfo" 属性 希望获取到用户的基本信息 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>   
    <text class="tip-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import { mapMutations, mapState } from "vuex"
  
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('m_user',  ['redirectInfo'])
    },
    methods: {
      // 2. 调用 mapMutations 辅助方法，把 m_user 模块中的 updateUserInfo updateToken 映射到当前组件中使用
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      
      
      // 调用登录接口 永久获取 token
      async gettoken(info) {
        
        // console.log(info);
        const [err, res] = await uni.login().catch(err => err)
        
        if(err || res.errMsg !== 'login:ok') return uni.$showError('登录失败!')
        
        // 准备对象参数 
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        console.log(query);
        
        // 网络请求 通过请求 query 生成 获取 token
        // 接口挂了无法获取到数据  只能自己写死一个 token 字符串
        // const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        
        // 判断 是否请求成功
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        uni.$showMsg('登录成功')
        
        // 调用 vuex 映射过来的模块 保存 token 到 vuex 里面
        // 由于接口 挂了 写死 一个 token
        this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
      },

      
      // 获取微信用户的基本信息
      // 登录授权的 方法修改成 getUserProfile()
      getUserProfile(e) {
        uni.getUserProfile({
          desc: '您的授权信息',
          // 成功获取用户信息
          success:(res) => {
            // console.log(res);
            // 3. 将用户的基本信息存储到 vuex 中
            // !!!!!!! 这里需要用到箭头函数  因为this的指向问题 普通函数指向的是调用者的作用域(没有调用者所有打印出来的是undefined) 箭头函数 指向 父级作用域
            // console.log(this);
            this.updateUserInfo(res.userInfo)
            
            // 获取登录成功后的 token 字符串
            this.gettoken(res)
            
            // 如果是 购物车跳转页面过来登录的 登录成功后重新跳转回去 购物车页面 
            this.navigateBack()
          },
          // 取消获取用户信息
          fail:(err) => {
            // console.log(err);
            return uni.$showMsg('您已取消登录授权!')
          }
        })
      },
      
      //如果是 购物车跳转页面过来登录的 登录成功后 掉哟这个方法 重新跳转回去 购物车页面 
      navigateBack() {
        // 判断 redirectInfo 是否存在 并且  redirectInfo.openType 是否是 switchTab 跳转页面方式
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // console.log(this.redirectInfo.from);
          uni.switchTab({
            url: this.redirectInfo.from,
            // 跳转成功后 把 redirectInfo 清空
            complete: () => {
              this.updateRedirectInfo = null
              // console.log(this.updateRedirectInfo);
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    overflow: hidden;   // 溢出隐藏 隐藏掉 伪元素的一半实现 弧度效果
    
    &::after {
        content: '';
        display: block;
        background-color: #f5f5f5;
        width: 100%;
        height: 40px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 100%;
        transform: translateY(50%);
    }
    
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }
    
      
    .tip-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>