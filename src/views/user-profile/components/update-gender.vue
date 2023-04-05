<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  // 组件名称
  name: 'UpdateGender',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
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
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        await updateUserProfile({
          gender: this.localGender
        })
        // console.log(data)
        // 更新视图
        this.$emit('input', this.localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新完成')
      } catch (error) {
        this.$toast.fail('修改性别失败')
      }
    },
    onPickerChange (picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style scoped lang="less">
  .update-gender {
    /deep/.van-picker__cancel {
      color: #3296fa;
    }
    /deep/.van-picker__confirm {
      color: #3296fa;
    }
  }
</style>
