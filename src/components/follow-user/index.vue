<template>
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="followLoading"
    v-if="!value"
    @click="onFollow"
  >关注</van-button>
  <van-button
    class="follow-btn"
    v-else
    round
    size="small"
    :loading="followLoading"
    @click="onFollow"
  >已关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  // 组件名称
  name: 'FollowUser',
  // 局部注册的组件
  components: {},
  // 通过 model 属性修改 v-model 传递给子组件的属性 value 的名称，以及默认监听的事件名 input
  // model: {
  //   prop: 'isFollowed', 默认是value
  //   event: 'update-is_followed' 默认是input
  // },
  // 组件参数 接收来自父组件的数据
  props: {
    // isFollow: {
    //   type: Boolean,
    //   required: true
    // },
    value: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      followLoading: false
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
    async onFollow () {
      // console.log(this.article.aut_id)
      this.followLoading = true
      try {
        if (this.value) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
          // console.log(data)
          // this.article.is_followed = false
        } else {
          // 没有关注，添加关注
          await addFollow(this.userId)
          // this.article.is_followed = true
          // console.log(data)
        }
        // this.article.is_followed = !this.article.is_followed
        // this.$emit('update_is_followed', !this.value)
        this.$emit('input', !this.value)
      } catch (error) {
        let message = '操作失败，请重试'
        if (error.response && error.response.status === 40) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.followLoading = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
