<template>
  <div>
    <!--    文字-->
    <div style="font-size: 30px;padding-left: 20px;margin-top: 10px;">
      我的
    </div>
    <!--    切换按钮-->
    <div @click="toMyBlog()" class="box2" :class="{'text-selected':dereactionStore.memberBlogDerection ===1}" style="font-size: 20px;display: flex;flex-direction: row;margin-top: 30px;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><collection /></el-icon></div>我的博客
    </div>
    <div @click="toPublishBlog()" class="box2" :class="{'text-selected':dereactionStore.memberBlogDerection ===2}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><promotion /></el-icon></div>发布内容
    </div>
    <div @click="toUpdateFile()" class="box2" :class="{'text-selected':dereactionStore.memberBlogDerection ===3}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><cloudy /></el-icon></div>云上存储
    </div>
  </div>
</template>

<script setup>
import {Cloudy, Collection, Expand, Histogram, Promotion, Refresh, TrendCharts} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {drectionStatusStore} from "../../../../pinia/honeBlog/DirectionStatusShare.js";
import {onMounted} from "vue";

onMounted (() => {

})

const router = useRouter();
const dereactionStore = drectionStatusStore()
const toMyBlog = () => {
  dereactionStore.memberBlogDerection = 1;
  router.push("/mobileDashboard/memberBlog");
}
const toPublishBlog = () => {
  dereactionStore.memberBlogDerection = 2;
  router.push("/mobileDashboard/memberPublishBlog");
}
const toUpdateFile = () => {
  dereactionStore.memberBlogDerection = 3;
  router.push("/mobileDashboard/updateFile");
}

</script>

<style scoped>
.input-define {
  width: 200px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #fff;
}
.input-define:focus {
  border-color: #409EFF; /* Element 的主色 */
  box-shadow: 0 0 3px rgba(64, 158, 255, 0.5);
}

.box2 {
  transition: background-color 0.3s; /* 平滑过渡 */
  text-align: center;
  line-height: 60px;
  cursor: pointer;
}

.box2:hover {
  background-color: rgb(208, 237, 250); /* 鼠标移上来时的颜色 */
}
.box2-selected {
  background-color: skyblue;
}
.text-selected {
  color: skyblue;
}
</style>