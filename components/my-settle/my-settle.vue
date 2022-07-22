<template>
  <view>
    <view class="my-settel-container">
      <!-- 全选 -->
      <label class="radio" @click="changeAllState">
        <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
      </label>
      <!-- 合计 -->
      <view class="amount-box">
        合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
      </view>
      <!-- 结算 -->
      <view class="btn-settle" @click="settlement">
        <text>结算({{checKoutCount}})</text>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from "vuex"

  export default {
    name: "my-settel",
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器的 ID
        timer: null,
      };
    },

    computed: {
      ...mapGetters('m_cart', ['checKoutCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),

      // 判断 勾选的数量 和 未勾选的数量 是否一样 如果一样 全选的勾选按钮为 true
      isFullCheck() {
        return this.checKoutCount === this.total
      }
    },

    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      // 点击全选或者全不选
      changeAllState() {
        // console.log(!this.isFullCheck);
        // 调用 vuex 里面的 方法 使按下全选按钮时 改变所有商品的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },

      // 点击结算按钮结算 结算前要判断 是否登录 是否选中地址 是否选择了商品
      settlement() {
        // 是否有商品数量
        if (!this.checKoutCount) return uni.$showMsg('请选择要结算的商品!')
        // 是否选择了地址
        if (!this.addstr) return uni.$showMsg('请选择地址!')
        // 是否已经登录 未登录 调用 延时 跳转页面函数
        // if(!this.token) return uni.$$showMsg('请先登录!')
        if (!this.token) return this.delayNavigate()

        // 实现 微信支付 在实现微信支付前 要设置请求拦截
        this.payOrder()
      },

      // 如果点击结算后未 登录 延时跳转到登录界面
      delayNavigate() {
        // 显示倒计时提示消息
        this.showTip(this.seconds)

        // 实现显示倒计时效果 每一秒 seconds -1
        // setInterval 和 setTimeout 的区别 在于
        // setTimeout 只执行一次 就是说 点击一次 执行一次 
        // setInterval 执行无数次 除非调用 clearInterval
        this.timer = setInterval(() => {
          this.seconds--

          // console.log(this.timer);
          if (this.seconds <= 0) {
            clearInterval(this.timer) // 关闭 定时器

            uni.switchTab({
              url: '/pages/my/my',
              // 登录成功后 调用 updateRedirectInfo 保存 登录方式 和 路径 到 vuex 在登陆界面 登录成功后跳转回来
              // 要用箭头函数
              success: () => {
                this.updateRedirectInfo({
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
            this.seconds = 3
            // 防止 跳转后 继续调用 showTip 所有要 return 出去
            return
          } else {
            // 每个一秒调用一次
            this.showTip(this.seconds)
          }
        }, 1000)
      },

      // 显示倒计时的提示消息
      showTip(n) {
        uni.showToast({
          icon: 'none',
          title: `请登录后在结算! ${n} 秒后跳转到登陆界面`,
          mask: true, // 防止在显示提示消息的时候 用户点击穿透
          duration: 1500 // 1.5秒后弹框消失
        })
      },

      // 调用方法 微信支付
      async payOrder() {
        // 1. 创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          order_price: this.checkedGoodsAmount, // 在开发测试中可以先把金额写死 否者支付不起 没 bug 后 引入 vuex 的 getter 计算 金额
          consignee_addr: this.addstr, // 收货地址
          // 已经勾选的上哦 过滤掉未勾选的 商品 用 map 方法 返回一个新的对象
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        // 1.2 发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        // 由于得到的是无效的 token 值 所有一下代码注释掉 无法实现支付
        console.log(res);


        // if(res.meta.status !== 200) return uni.$showMsg('创建订单失败')
        // console.log(res.message);        

        // 1.3 得到服务器响应的 '订单编号'
        // 由于 token 是写死的 所有请求不过来 订单编号 自定义一个订单编号
        // const orderNumber = res.message.order_number   
        // console.log(orderNumber);
        // const orderNumber = 'GD20080504000000000045'

        // 2. 订单预支付
        // 2.1 发起请求获取订单的支付信息
        // const {data: res2} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {order_number: orderNumber})

        // // 2.2 预付订单生成失败
        // if(res2.meta.status !== 200) return uni.$showMsg(' 预付订单失败')
        // console.log(res2);
        // 2.3 得到订单相关的必要参数
        // const payInfo = res2.message.pay

        // 3. 发起微信支付
        // 3.1 调用 uni.requestPayment() 发起微信支付
        // const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 未完成支付
        // if (err) return uni.$showMsg('订单未支付！')
        // 3.3 完成了支付，进一步查询支付的结果
        // const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
        // 3.4 检测到订单未支付
        // if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // 3.5 检测到订单支付完成
        // uni.showToast({
        //   title: '支付完成！',
        //   icon: 'success'
        // })
      }
    }
  }
</script>

<style lang="scss">
  .my-settel-container {
    height: 50px;
    width: 100%;
    position: fixed; // 固定定位
    bottom: 0;
    left: 0;
    background-color: white;
    z-index: 999999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    vertical-align: middle;
    box-shadow: 0 0 25px #efefef;

    .radio {}

    .amount-box {

      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #C00000;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px; // 最小宽度
    }
  }
</style>
