<template>
  <div style="height: calc(100vh - 65px)">
<!--    搜索框返回-->
    <div style="display: flex;padding-left: 20px;height: 50px;justify-content: space-between;padding-right: 20px">
      <div @click="back()" style="display: flex;align-items: center;" class="search-back"><el-icon size="20"><ArrowLeftBold /></el-icon></div>
      <div style="display: flex;align-items: center;width: 530px"><el-input v-model="blogSearchStore.searchValue" style="width: 100%;height: 40px" placeholder="搜索" /></div>
      <div style="display: flex;align-items: center;"><el-button style="height: 38px" type="info" plain><el-icon><Search /></el-icon>搜索</el-button></div>
    </div>
<!--    类别-->
    <div style="display: flex;justify-content: space-between;padding-left: 20px;padding-right: 20px;margin-top: 20px;">
      <el-tabs
          v-model="activeName"
          class="custom-tabs"
          @tab-click="handleClick"
      >
        <el-tab-pane label="博客" name="1">博客内容</el-tab-pane>
        <el-tab-pane label="用户" name="2">用户内容</el-tab-pane>
      </el-tabs>
    </div>
<!--    内容-->
    <div style="height: calc(100vh - 175px);overflow: auto;scrollbar-width: none;">
      <router-view></router-view>
    </div>
  </div>

</template>

<script setup>

import {ArrowLeftBold, Search} from "@element-plus/icons-vue";
import {onBeforeMount, onBeforeUnmount, ref} from "vue";
import {useBlogSearchStore} from "../../../../pinia/search/useBlogSearchStore.js";
import {useRouter} from "vue-router";
import {useMemberSearchStore} from "../../../../pinia/search/useMemberSearchStore.js";

const activeName = ref('1')
const blogSearchStore = useBlogSearchStore()
const memberSearchStore = useMemberSearchStore()
const router = useRouter()

const handleClick = () => {
  if (activeName.value === '1') {
    router.push("/mobileDashboard/homeSearch/searchMember")
  }
  if (activeName.value === '2') {
    router.push("/mobileDashboard/homeSearch/searchBlog")
  }
}
const back = () => {
  router.back()
}
onBeforeUnmount(() => {
  blogSearchStore.reset()
  memberSearchStore.reset()
})
</script>

<style scoped>
.search-back {
  cursor: pointer;
}
.search-back:hover {
  color: skyblue;
}
.custom-tabs {
  width: 640px;
  height: 40px;
  margin: 0 auto;
}

/* 让每个 tab header 宽度固定为 320px */
.custom-tabs ::v-deep(.el-tabs__nav) {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.custom-tabs ::v-deep(.el-tabs__item) {
  width: 320px !important;
  text-align: center;
  margin: 0;
  padding: 0;
}
</style>