<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div class="two-btn" v-if="isDeleteShow">
        <span @click="searchHistories.splice(0)">全部删除</span>
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell :title="item" v-for="(item, index) in searchHistories" :key="index" @click="onSearchItemClick(item, index)">
      <van-icon name="close" v-show="isDeleteShow"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'SearchHistory',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    // prop 数据
    // prop 是受父组件数据影响的
    // 普通数据（数字，字符串，布尔值）绝对不能修改，即便改了也不会传导给父组件
    // 引用类型数据（数组，对象）可以修改但不能重新赋值
    //     可以修改：[].push()
    //     不能赋值：xxx = []
    searchHistories: {
      type: Array,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () {},
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () {},
  // 组件方法
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-history {
  .two-btn {
    span {
      margin-left: 10px;
    }
  }
}
</style>
