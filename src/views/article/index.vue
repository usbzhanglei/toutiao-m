<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <!--
            模板中的 $event 是事件参数
            当我们传递给子组件的数据既要使用还有修改。
              传递：props
                :isFollow="article.is_followed"
              修改：自定义事件
                @update_is_followed="article.is_followed = $event"
              简写方式：在组件上使用v-model
              相当于
              v-model会给子组件传递一个名为 value 的参数 且默认监听 @input 事件
                value="article.is_followed"
                @input="article.is_followed = $event"
              通过子组件的 model 属性来修改配置名称
              一个组件上只能使用一次 v-model
              如果有多个数据需要实现类似于 v-model 的效果 可以使用属性的.sync修饰符
           -->
           <!--
            :num="num"
            @update:num="num=$event"
            相当于
            :num.sync="num"
            默认在子组件可以通过update:num的事件来修改当前父传子的数据
            -->
           <FollowUser
            class="follow-btn"
            :userId="article.aut_id"
            v-model="article.is_followed"
          ></FollowUser>
          <!-- <FollowUser
            :isFollow="article.is_followed"
            class="follow-btn"
            :userId="article.aut_id"
            @update_is_followed="article.is_followed = $event"
          ></FollowUser> -->
          </van-cell>
          <!-- <van-button
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="followLoading"
            v-if="!article.is_followed"
            @click="onFollow"
          >关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFollow"
          >已关注</van-button>
        </van-cell> -->
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <CommentList
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          :list="commentList"
          @reply-click="onReplayClick"
        ></CommentList>
        <!-- 文章评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论
          </van-button>
          <van-icon class="comment-icon" name="comment-o" :badge="totalCommentCount" />
          <!-- <van-button class="btn-item" icon="star-o" /> -->
          <CollectArticle class="btn-item" v-model="article.is_collected" :articleId="article.art_id"/>
          <!-- <van-button class="btn-item" icon="good-job-o" /> -->
          <LikeArticle class="btn-item" v-model="article.attitude" :articleId="article.art_id"/>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup v-model="isPostShow" position="bottom">
          <CommentPost
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></CommentPost>
        </van-popup>
        <!-- 发布评论 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!--
      popup弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示和隐藏
    -->
    <van-popup v-model="isReplayShow" position="bottom" style="height: 100%;">
      <CommentReplay v-if="isReplayShow" :currentComment="currentComment" @close="isReplayShow = false"></CommentReplay>
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import FollowUser from '@/components/follow-user'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReplay from './components/comment-replay'
// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   // 起始位置，从0开始
//   startPosition: 1,
//   onClose () {
//     this.$toast('关闭')
//   }
// })
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CommentList,
    CommentPost,
    CommentReplay,
    CollectArticle,
    LikeArticle
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true,
      errStatus: 0// 失败的状态码
    }
  },
  // 给所有的后代组件提供数据
  // 注意：不要滥用
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data () {
    return {
      article: {},
      loading: true,
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论显示状态
      commentList: [], // 评论列表
      isReplayShow: false,
      currentComment: {} // 当前点击回复的评论项
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      // 展示loading加载中
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        // 请求成功关闭loading
        // this.loading = false
        // console.log(data)
        // 初始化图片点击预览
        // 数据驱动视图不是立即的
        // this.$refs['article-content']
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
        // this.loading = false
        // console.log('获取数据失败')
      }
      // 无论成功还是失败都要关闭loading
      this.loading = false
    },
    previewImage () {
      // 得到所有的img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从0开始
            startPosition: index
          })
        }
      })
    },
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
      this.totalCommentCount++
    },
    onReplayClick (comment) {
      // console.log(comment)
      this.isReplayShow = true
      this.currentComment = comment
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
