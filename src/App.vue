<template>
  <div id="app">
    <!-- 路由的出口 -->
    <router-view />
    <!-- 行内样式 px 无法转换为 rem -->
    <!-- <div class="box" style="padding: 20px;"></div> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang="less">
</style>
