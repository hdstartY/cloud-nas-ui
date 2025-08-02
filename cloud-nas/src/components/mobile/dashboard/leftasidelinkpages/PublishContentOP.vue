<template>
  <div style="display: flex;justify-content: space-between;padding-left: 20px;padding-right: 20px;margin-top: 20px;">
    <el-tabs
        v-model="activeName"
        class="custom-tabs"
        @tab-click="handleClick"
    >
      <el-tab-pane label="发布博客" name="blog"></el-tab-pane>
      <el-tab-pane label="发布视频" name="video"></el-tab-pane>
    </el-tabs>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
  import {ref} from "vue";
  import {useRouter} from "vue-router";

  const router = useRouter();

  const activeName = ref('blog')
  const handleClick = (tabPane) => {
    activeName.value = tabPane.props.name
    if (activeName.value === 'blog') {
      router.push("/mobileDashboard/memberPublishBlog/blog")
    }
    if (activeName.value === 'video') {
      router.push("/mobileDashboard/memberPublishBlog/video")
    }
  }
</script>

<style scoped>
.custom-tabs {
  width: 640px;
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