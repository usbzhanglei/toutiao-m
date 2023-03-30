<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text, index) in suggestion"
      :key="index"
      icon="search"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  // 组件名称
  name: 'SearchSuggestion',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      suggestion: []// 联想建议数据列表
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    searchText: {
      // handler (value) {
      //   this.loadSearchSuggestions(value)
      // },
      // 当searchText发生改变时会触发handler函数
      // handler名称是固定的
      // value是变化后的最新数据
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
        // console.log(value)
      }, 300),
      // 该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
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
    async loadSearchSuggestion (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        // console.log(data)
        this.suggestion = data.data.options
      } catch (error) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      if (!text) return
      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是变量数据
      // 如果需要根据数据变量动态创建正则表达式，则需要手动new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, `<span class="active">${this.searchText}</span>`)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
