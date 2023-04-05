<template>
  <div class="comment-replay">
    <van-nav-bar
      :title="currentComment.reply_count > 0 ? `有${currentComment.reply_count}条回复` : '暂无回复'"
    >
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('close')"
      ></van-icon>
    </van-nav-bar>
    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="currentComment"></comment-item>
      <!-- 当前评论项 -->
      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <commentList
        :list="commentList"
        :source="currentComment.com_id"
        type="c"
      />
      <!-- 评论的回复列表 -->
    </div>
    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow = true">写评论</van-button>
    </div>
    <!-- 发布评论 -->
    <!-- 发布评论的弹层，视频里面没有提到，自行补充 -->
    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost :target="currentComment.com_id" @post-success="onPostSuccess"></CommentPost>
    </van-popup>
  </div>
</template>

<script>
import commentItem from './comment-item.vue'
import commentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  // 组件名称
  name: 'CommentReplay',
  // 局部注册的组件
  components: {
    commentItem,
    commentList,
    CommentPost
  },
  // 组件参数 接收来自父组件的数据
  props: {
    currentComment: {
      type: Object,
      required: false
    }
  },
  // 组件状态值
  data () {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
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
    onPostSuccess (data) {
      // console.log(data)
      // 更新回复的数量
      this.currentComment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新回复的内容展示到列表顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
  .scroll-wrap {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
  }
  .post-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88px;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .post-btn {
      width: 60%;
    }
  }
</style>
