<template>
<!--  总块-->
  <div style="width: 100%">
<!--    头顶导航-->
    <div style="width: 100%;height: 50px;background-color: skyblue;display: flex">
<!--      展示-->
      <div style="width: 340px;height: 100%;background-color:gray ;display: flex;align-items: center;justify-content: center;font-size: 20px">
        我的
      </div>
<!--      发布-->
      <div style="width: 340px;height: 100%;display: flex;align-items: center;justify-content: center;font-size: 20px">
        上传
      </div>
    </div>

<!--    具体内容-->
    <div><router-view></router-view></div>
  </div>

</template>

<script setup>

</script>

<style scoped>

</style>