<template>
  <div id="app">
    <h1>黑马头条</h1>
    <i class="iconfont icon-shouye"></i>
    <!-- 路由的出口 -->
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <router-view />
    <!-- 行内样式 px 无法转换为 rem -->
    <div class="box" style="padding: 20px;"></div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang="less">
.box {
  width: 200px;
  height: 200px;
  background-color: red;
}
</style>
