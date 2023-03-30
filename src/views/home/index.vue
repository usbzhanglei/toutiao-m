<template>
  <div class="home-container">
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        class="search-btn"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!--
      通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。
      通过 animated 属性可以开启切换标签内容时的转场动画。
      通过 swipeable 属性可以开启滑动切换标签页。
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="obj in channels" :key="obj.id" :title="obj.name">
        <!-- 文章列表 -->
        <ArticleList :channel="obj" />
        <!-- 文章列表 -->
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChennelEditShow = true">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
      close-icon-position="top-left"
    >
      <ChannelEdit :my-channels="channels" :active="active" @update-active="onUpdateActive"></ChannelEdit>
    </van-popup>
    <!-- 频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'HomeIndex',
  // 局部注册的组件
  components: {
    ArticleList,
    ChannelEdit
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChennelEditShow: false// 控制编辑弹出层的显示状态
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () {
    this.loadChannels()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () {},
  // 组件方法
  methods: {
    async loadChannels () {
      try {
        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            //    有，拿来使用
            this.channels = localChannels
          } else {
            //    没有，请求获取默认列表数据
            const { data } = await getUserChannels()
            // console.log(data)
            this.channels = data.data.channels
          }
        }
        // this.channels = channel
      } catch (error) {
        this.$toast('获取频道数据失败！')
      }
    },
    onUpdateActive (index, isChennelEditShow = true) {
      // 更新激活频道项
      this.active = index
      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style scoped lang="less">
  .home-container {
    padding-top: 174px;
    padding-bottom: 100px;
    /deep/.van-nav-bar__title {
      max-width: 90%;
      .search-btn {
        width: 555px;
        height: 64px;
        background-color: #5babfb;
        border: none;
        font-size: 28px;
        .van-icon {
          font-style: 32px;
        }
      }
    }
    /deep/.channel-tabs {
      .van-tabs__wrap {
        position: fixed;
        top: 92px;
        height: 82px;
        left: 0;
        right: 0;
        z-index: 1;
      }
      .van-tab {
        min-width: 200px;
        border-right: 1px solid #edeff3;
        font-style: 30px;
        color: #777;
      }
      .van-tab--active {
        color: #333;
      }
      .van-tabs__nav {
        padding-bottom: 0;
      }
      .van-tabs__line {
        bottom: 8px;
        width: 31px !important;
        height: 6px;
        background-color: #3296fa;
      }
      .hamburger-btn {
        position: fixed;
        right: 0;
        width: 66px;
        height: 82px;
        text-align: center;
        line-height: 82px;
        background-color: #fff;
        opacity: .902;
        i.iconfont {
          font-style: 33px;
        }
        &::before {
          content: "";
          position: absolute;
          left: 0;
          width: 1px;
          height: 100%;
          background-image: url(~@/assets/gradient-gray-line.png);
          background-size: contain;
        }
      }
      .placeholder {
        width: 66px;
        height: 82px;
        // 参与剩余空间的计算
        flex-shrink: 0;
      }
    }
  }
</style>
