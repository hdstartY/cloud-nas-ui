<template>
  <div class="login-container">
    <!-- 左侧标题区域 -->
    <div class="left-layout">
      <div style="font-size: 60px">Cloud-NAS后台管理</div><br>
      <div style="font-size: 20px">登录或注册</div>
    </div>

    <!-- 右侧登录表单区域 -->
    <div class="right-layout">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
}

.left-layout {
  height: 100%;
  width: 55%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.right-layout {
  height: 100%;
  width: 45%;
  display: flex;
  align-items: center;
}

</style>
