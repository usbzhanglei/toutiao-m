<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请点击重试"
      @load="onLoad"
    >
    <!-- :to="{name: 'article', params: { articleId: article.art_id }}"   -->
    <!-- :to="`/article/${item.art_id}`" -->
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
        :to="{name: 'article', params: { articleId: item.art_id }}"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  // 组件名称
  name: 'SearchResult',
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
      list: [],
      article: '',
      error: false,
      loading: false,
      page: 1,
      per_page: 20,
      finished: false
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
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.per_page, // 每页大小
          q: this.searchText// 搜索关键字
        })
        // 2. 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 3. 设置加载状态结束
        this.loading = false
        // 4. 判断数据是否加载完毕
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
