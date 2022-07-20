<template>
  <view class="goods-item">
    <!-- ？商品列表左侧图片 -->
    <view class="goods-left">
      <radio :checked="item.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHanler"></radio>
      <image :src="item.goods_small_logo || defaultPic" class="goods-img"></image>
    </view>
    <!-- 商品列表右侧文本 -->
    <view class="goods-right">
      <!-- 商品名字 -->
      <view class="goods-name">{{item.goods_name}}</view>
      <!-- 商品价格 -->
      <view class="goods-info-box">
        <view class="goods-price">￥{{item.goods_price | tofixed}}</view>
        <uni-number-box :min="0" :value="item.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    data() {
      return {
        // 为了防止某些商品图片不存在， 默认显示这张图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },

    // 父传子

    props: {
      // 父组件传过来的 商品
      item: {
        type: Object,
        default () {
          return {}
        }
      },
      // 是否展示图片左侧的 radio
      showRadio: {
        type: Boolean,
        // 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
        default: false,
      },
      // 是否展示商品右侧的 NumberBox 组件
       showNum: {
         type: Boolean,
         default: false
       }
    },

    // 过滤器
    filters: {
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    
    // 方法
    methods: {
      // 点击 勾选框 获取该商品的属性 传给 父组件 显示是否勾选
      radioClickHanler() {
        this.$emit('radio-change', {
          // 不需要传参 直接获取到 当前商品
          goods_id: this.item.goods_id,
          goods_state: this.item.goods_state
        })
      },
      
      // NumberBox 组件的 change 事件处理函数
      // value 参数 是修改的数量
      numChangeHandler(value) {
        // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
        // console.log(value);
        this.$emit('num-change', {
          // 商品的 Id
          goods_id: this.item.goods_id,
          // 商品的最新数量
          goods_count: +value
        })
        }
    }

  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
  }

  .goods-price {
    font-size: 16px;
    color: #c00000;
  }

  .goods-name {
    font-size: 13px;
  }

  .goods-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
  }

  .goods-img {
    width: 100px;
    height: 100px;
    display: block;
  }

  
  .goods-left {
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .goods-info-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
