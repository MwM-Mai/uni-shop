<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view scroll-y="true" class="letf-scroll-view" :style="{height: wh + 'px'}">
        <!-- 左侧列表选项 -->
        <block v-for="(item, index) in cateList" :key="index">
          <view :class="['letf-scroll-view-item', index === active ? 'active' : '']" @click="activeChanged(index)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧滑动区域 -->
      <scroll-view scroll-y="true" class="right-scroll-view" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <block v-for="(item2, index2) in cateLeve2" :key="index2" class="cate-lv2">
          <!-- 渲染二级分类 -->
          <view class="cate-lv2-title">/{{item2.cat_name}}/</view>
          <!-- 渲染当前二级分类下的三级分类 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3, index3) in item2.children" :key="index3" @click="gotoGoosList(item3)">
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon" mode="" class="cate-lv3-item-img"></image>
              <!-- 三级分类的文本 -->
              <text class="cate-lv3-item-text">{{item3.cat_name}}</text>
            </view>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 当前设备的可用高度
        wh: 0,
        // 分类列表 
        cateList: [],
        // 默认的激活项
        active: 0,
        // 二级分类
        cateLeve2: [],
        // 三级分类
        cateleve3: [],
        // 滚动条距离顶部的距离
        scrollTop: 0
      };
    },
    onLoad() {
      // uni.getSystemInfoSync() 获取当前设备的方法（同步）
      const sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight
      this.getCateList()
    },
    methods: {
      // 获取分类列表数据
      async getCateList() {
        const {data: res} = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        
        // 获取二级分类列表
        this.cateLeve2 = res.message[0].children
        
        // 获取三级分类列表
        this.cateleve3 = res.message[0].children[0].children
      },
      
      
      
      // 点击分类列表
      activeChanged(index) {
        // 赋值当前点击的index 显示活跃状态
        this.active = index
        
        // 点击当前列表项 重新赋值二级分类列表
        this.cateLeve2 = this.cateList[index].children
        
        // 点击切换分类列表项 右侧滚动条置顶 
        // 如果 scrollTop 如果赋值前后是一样的 那么是不会 进行 滚动条位置重置的
        // 所有每次点击都赋不一样的值 1像素 用户体验没区别
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      
      // 点击三级分类图片 跳转商品列表页面
      gotoGoosList(item) {
        uni.navigateTo({
          url:'/subpkg/goos_list/goos_list?cid=' + item.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
.scroll-view-container{
  display: flex;
}

.letf-scroll-view {
  width: 120px;
  .letf-scroll-view-item {
    background-color: #f7f7f7;
    line-height: 60px;
    text-align: center;
    font-size: 12px;
    
    // scss &. 代表的是 当前类下 
    &.active {
      background-color: #ffffff;
      position: relative;
      
      // 伪元素 为选中的元素添加修饰内容 ::before 父元素的开头
      &::before {
        content: '';
        display: block;
        width: 3px;
        height: 30px;
        background-color: #C00000;
        position: absolute;
        left: 0;
        top: 50%;  // 相对于父元素移动 50% 父元素是60xp  所有移动到底部
        transform: translateY(-50%);  // 相对于自己移动 50% 自己 30px 移动15px
      }
    }
  }
}

.cate-lv2-title {
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  padding: 15px 0;
}

.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;
  
  .cate-lv3-item {
    width: 33.33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    
    .cate-lv3-item-img{
      width: 60px;
      height: 60px;
    }
    
    .cate-lv3-item-text{
      font-size: 12px;
    }
  }
  
}
</style>
