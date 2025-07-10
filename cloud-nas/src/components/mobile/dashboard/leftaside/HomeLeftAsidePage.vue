<template>
  <div>
<!--    文字-->
    <div style="font-size: 30px;padding-left: 20px;margin-top: 10px;">
      首页
    </div>
<!--    切换按钮-->
    <div @click="toRecommend()" class="box2" :class="{'text-selected':blogStore.selectItem ===1}" style="font-size: 20px;display: flex;flex-direction: row;margin-top: 30px;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><histogram /></el-icon></div>推荐
    </div>
    <div @click="toNew()" class="box2" :class="{'text-selected':blogStore.selectItem ===2}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><refresh /></el-icon></div>最新
    </div>
    <div @click="toCategory()" class="box2" :class="{'text-selected':blogStore.selectItem ===3}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><Operation /></el-icon></div>分类
    </div>
  </div>
</template>

<script setup>
import {Histogram, Operation, Refresh, TrendCharts} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {homeBlogStore} from "../../../../pinia/honeBlog/HomeBlogShared.js";

const router = useRouter();
const blogStore = homeBlogStore()

const selectItemNum = ref(1)
const toRecommend = () => {
  blogStore.selectItem = 1;
  blogStore.sortField = 'default'
  router.push("/mobileDashboard/home")
}
const toNew = () => {
  blogStore.sortField = 'b.create_time'
  blogStore.selectItem = 2
}
const toCategory = () => {
  blogStore.selectItem = 3
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