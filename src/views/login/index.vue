<template>
  <div class="login-container">
    <!-- 导航栏  -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()"></van-icon>
    </van-nav-bar>
    <!-- 导航栏  -->

    <!-- 登录表单 -->
        <!--
      表单验证：
        1、给 van-field 组件配置 rules 验证规则
          参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2、当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit
     -->
    <van-form ref="loginFrom" @submit="onSubmit">
      <van-field
        v-model = "user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFromRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field
        v-model = "user.code"
        name="code"
        placeholder="请输入验证码"
        class="login-bor"
        :rules="userFromRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <!--time属性表示倒计时总时长，单位为毫秒 ： 1000*5 表示5s
            通过format属性设置倒计时文本的格式 ： ss s ，ss表示时间格式只有秒，s表示字符格式
            finish是完成事件：倒计时结束时会触发
            -->
          <van-count-down
            class="send-sms-btn"
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            class="send-sms-btn"
            round size="small"
            type="default"
            native-type="button"
            @click="onSaveSms"
            v-else
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          block
          type="info"
          native-type="submit"
        >登录</van-button>
      </div>
    </van-form>
    <!-- 登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: ''// 验证码
      },
      userFromRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false// 是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      // 1.获取数据
      const user = this.user
      // 2.表单验证
      // 在组件中必须通过 this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0// 持续时间，默认2000,如果为0则持续展示
      })
      // 3.提交表单请求登录
      try {
        const { data } = await login(user)
        // console.log('登录成功' + res)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // 登录成功，跳转到原来页面
        // back()不严谨，后面功能优化再说
        this.$router.back()
        // console.log(res)
      } catch (error) {
        // console.log(error)
        if (error.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 4.根据请求响应结果
    },
    async onSaveSms () {
      // 1.校验手机号
      try {
        await this.$refs.loginFrom.validate('mobile')
        console.log('验证成功')
      } catch (error) {
        return console.log('验证失败' + error)
      }
      // 2.校验通过，显示倒计时
      this.isCountDownShow = true
      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (error) {
        // 发送失败关闭倒计时
        this.isCountDownShow = false
        if (error.response.status === 429) {
          this.$toast('发送频繁，请稍后')
        }
        this.$toast('发送失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .login-container {
    position: relative;
    .iconfont {
      font-size: 37px;
    }
    .login-bor {
      /deep/.van-field__control {
        border-right: 2px solid #eeeeee;
      }
    }
    .send-sms-btn {
      text-align: center;
      border-radius: 23px;
      width: 160px;
      height: 46px;
      line-height: 46px;
      font-size: 22px;
      background-color: #ededed;
      color: #666666;
      padding: 0;
    }
    .login-btn-wrap {
      margin: 53px 33px;
      .login-btn {
        background-color: #6db4fb;
        border: none;
      }
    }
}
</style>
