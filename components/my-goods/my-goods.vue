<template>
  <view class="goods-item">
    <!-- ？商品列表左侧图片 -->
    <view class="goods-left">
      <image :src="item.goods_small_logo || defaultPic" class="goods-img"></image>
    </view>
    <!-- 商品列表右侧文本 -->
    <view class="goods-right">
      <!-- 商品名字 -->
      <view class="goods-name">{{item.goods_name}}</view>
      <!-- 商品价格 -->
      <view class="goods-info-box">
        <view class="goods-price">￥{{item.goods_price | tofixed}}</view>
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
      item: {
        type: Object,
        default () {
          return {}
        }
      }
    },

    // 过滤器
    filters: {
      tofixed(num) {
        return Number(num).toFixed(2)
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
    flex-direction: column;
    justify-content: space-between;
  }

  .goods-img {
    width: 100px;
    height: 100px;
    display: block;
  }

  .goods-item-left {
    margin-right: 5px;
  }
</style>
