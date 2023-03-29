<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in myChannels"
        :key="index"
        @click="onMyChannelChick(channel,index)"
      >
      <!--
        v-bind:class 语法
        一个对象：对象中的 key 表示要作用的 CSS类名
                 对象中的 value 表示要计算出的布尔值
                    true：则作用类名
                    false：不作用类名
       -->
        <van-icon
          v-show="isEdit && !fiexChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span
          slot="text"
          class="text"
          :class="{ active: index === active }"
        >{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        icon="plus"
        v-for="(channel,index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- 频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannels, deleteUserChannels } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'ChannelEdit',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0] // 固定频道，不允许删除
    }
  },
  // 计算属性
  // 计算属性会观测内部依赖数据的变化
  // 如果依赖的数据发生变化，则计算属性会重新执行
  computed: {
    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     // find 遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannels => {
    //       return myChannels.id === channel.id
    //     })
    //     // 如果我的频道不包含该频道项，则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   // console.log(channels)
    //   return channels
    // }
    ...mapState(['user']),
    recommendChannels () {
      return this.allChannels.filter(channel => {
        // return !this.myChannels.find(myChannel => myChannel.id === channel.id)
        return !this.myChannels.some(myChannel => myChannel.id === channel.id)
      })
    }
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () {
    this.loadAllChannels()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () {},
  // 组件方法
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allChannels = data.data.channels
        // console.log(this.allChannels)
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 数据持久化
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          addUserChannels({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序号
          })
        } catch (error) {
          // console.log(error)
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelChick (channel, index) {
      // console.log(channel, index)
      if (this.isEdit) {
        // 如果是固定频道，则不删除
        if (this.fiexChannels.includes(channel.id)) {
          return
        }
        // 编辑状态，执行删除频道
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.myChannels.splice(index, 1)
        // 数据持久化
        this.deleteChannel(channel.id)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (id) {
      try {
        if (this.user) {
          // 已登录，则将数据更新到线上
          deleteUserChannels(id)
        } else {
          // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (error) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .channel-edit {
    padding: 85px 0;
    .title-text {
      font-size: 32px;
      color: #333;
    }
    .edit-btn {
      width: 104px;
      height: 48px;
      font-size: 26px;
      color: #f85959;
      border: 1px solid #f85959;
    }
    /deep/.grid-item {
      width: 160px;
      height: 86px;
      .van-grid-item__content {
        white-space: nowrap;
        background-color: #f4f5f6;
        .van-grid-item__text,.text {
          margin-top: 0;
          font-style: 28px;
          color: #222;
        }
        .active {
          color: red;
        }
      }
    }
    /deep/.my-grid {
      .grid-item {
        .van-grid-item__icon-wrapper {
          position: static;
        }
        .van-icon-clear {
          position: absolute;
          right: -5px;
          top: -5px;
          z-index: 2;
          color: #cacaca;
          font-size: 15px;
        }
      }
    }
    /deep/.recommend-grid {
      .grid-item {
        .van-grid-item__content {
          flex-direction: row;
          .van-grid-item__icon {
            font-size: 28px;
          }
          .van-grid-item__text {
            margin-left: 6px;
          }
        }
      }
    }
  }
</style>
