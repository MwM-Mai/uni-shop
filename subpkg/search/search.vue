<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar :radius="100" @input="input" cancelButton="none" :value="value"></uni-search-bar>
    </view>
    <!-- 搜索数据 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, index) in searchResults" :key="index">
        <view class="goods-name" @click="gotoDetail(item)">{{item.goods_name}}</view>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="18" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :inverted="true" :text="item" @click="bindClick(item)" v-for="(item, index) in history" :key="index" style="margin-top: 5px;margin-right: 5px;"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    // 数据
    data() {
      return {
        // 防抖
        timer: null,
        // 搜索框的字段
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索历史的数据
        histroyList: [], 
        // 点击搜索历史某项的value
        value: ''
      };
    },
    
    
    // 计算属性
    
    computed: {
      // 利用计算属性反转数组不会改变数组的数据 展示出想要的效果
      // 然后遍历计算属性的历史数据即可
      history() {
        return [...this.histroyList].reverse()
      }
    },
    
    
    // 方法
    
    methods: {
      // 请求搜索结果列表数据
      async getSearchList() {
        // 搜索关键词是否为空
        if(this.kw === '') {
          this.searchResults = []
           return
        }
        
        const {data: res} = await uni.$http.get('/api/public/v1/goods/search', {query: this.kw})
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        
        // 请求成功 获取 关键词搜索建议的数据
        this.searchResults = res.message.goods;
        
        // 获取关键词搜索建议的数据后 保存关键词到历史数据中 最新数据在前面
        this.saveSearchHistory()
        
        
      },
      
      
      
      
      
      
      // input输入事件的处理函数
      input(e) {
          clearTimeout(this.timer)
        this.timer =  setTimeout(() => {
          this.kw = e
          // console.log(this.kw);
          // 根据关键词获取查询搜索列表
          this.getSearchList()
        }, 500)
      },
    
      
      // 点击跳转到详情页
      gotoDetail(item) {
        uni.navigateTo({
          url: '../goos_detail/goos_detail?goods_id=' + item.goods_id
        })
      },
      
      // 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
      saveSearchHistory() { 
        //  利用 computed 属性反转数组
        // this.histroyList.push(this.kw)
        const arr = new Set(this.histroyList)
        // 输入关键字时候 删除 历史数据的同样关键字
         arr.delete(this.kw)
         // 再添加输入关键字
         arr.add(this.kw)
         
         this.histroyList = [... new Set(arr)]
        
        // 对搜索历史数据 进行本地储存
        // 键值对形式
        uni.setStorageSync('kw', JSON.stringify(this.histroyList))
      },
      
      // 点击删除小图标 清空历史记录
      clean() {
        // 对搜索历史数据 进行清空
        this.histroyList = []
        // 本地储存空数据 键值对形式
        uni.setStorageSync('kw', JSON.stringify(this.histroyList))
      },
      
      // 点击某个历史数据项 加到搜索框里面去
      bindClick(item) {
        console.log(item);
        this.kw = item
        this.value = item 
        this.getSearchList()

      }
    },
    
    // 生命周期函数 加载的时候
    
    onLoad() {
      // 在加载的过程中将本地存储数据 获取 本地搜索历史数据到data中
       this.histroyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    }
  }
</script>

<style lang="scss">
.search-box {
  // 固定定位 吸顶效果
  position: sticky;
  // 吸顶位置 顶部
  top: 0;
  z-index: 9999;
}

.sugg-list {
  padding: 0 5px;
  
  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefefef;
    justify-content: space-between;
    align-items: center;
    display: flex;
    
    .goods-name {
      // 文本不许换行
      white-space: nowrap;
      // 溢出隐藏
      overflow: hidden;
      // 文本溢出后用 ... 显示
      text-overflow: ellipsis;
      margin-right: 3px;
    }
    
  }
  
}

.history-box {
  padding: 0 5px;
  
  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid #efefef;
    font-size: 13px;

    .history-list {
      display: flex; 
      flex-wrap: wrap;
      
      
    }
  
  }
}



</style>
