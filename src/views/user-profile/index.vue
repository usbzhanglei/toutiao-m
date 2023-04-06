<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- 导航栏 -->
    <input
      type="file"
      hidden
      ref="file"
      @change="onFileChange"
    >
    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image
        class="avatar"
        center
        fit="cover"
        round
        :src="user.photo"
      />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="user.gender ? '女' : '男'"
      is-link
      @click="isUpdateGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthShow = true"
    ></van-cell>
    <!-- 个人信息 -->
    <!-- 编辑昵称 -->
    <van-popup v-model="isUpdateNameShow" style="height: 100%;" position="bottom">
      <UpdateName v-if="isUpdateNameShow" @close="isUpdateNameShow = false" v-model="user.name" @input="user.name = $event"/>
    </van-popup>
    <!-- 编辑昵称 -->
    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender v-if="isUpdateGenderShow" v-model="user.gender" @close="isUpdateGenderShow = false"/>
    </van-popup>
    <!-- 编辑性别 -->
    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthShow" position="bottom">
      <update-birthday v-if="isUpdateBirthShow" v-model="user.birthday" @close="isUpdateBirthShow = false"/>
    </van-popup>
    <!-- 编辑生日 -->
    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%;"
    >
      <update-photo v-if="isUpdatePhotoShow" :img="img" @close="isUpdatePhotoShow = false" @update-photo="user.photo = $event"/>
    </van-popup>
    <!-- 编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  // 组件名称
  name: 'UserProfile',
  // 局部注册的组件
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      user: {}, // 用户的个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthShow: false,
      isUpdatePhotoShow: false,
      img: null // 预览的图片
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
  created () {
    this.loadUserProfile()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () {},
  // 组件方法
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (error) {
        this.$toast('获取用户信息失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      // console.log(this.img)
      // console.log(data)
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true
      // file-input 如果选中了同一个文件 则不会重复change事件
      // 解决方法：每次使用完毕将 value 清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
  .user-profile {
    .avatar {
      width: 60px;
      height: 60px;
    }
    .van-popup {
      background-color: #f5f7f9;
    }
  }
</style>
