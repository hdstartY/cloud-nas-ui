<template>
  <div>
    <!--    文字-->
    <div style="font-size: 30px;padding-left: 20px;margin-top: 10px;">
      信息
    </div>
    <!--    切换按钮-->
    <div @click="toMyBlog()" class="box2" :class="{'text-selected':selectItemNum ===1}" style="font-size: 20px;display: flex;flex-direction: row;margin-top: 30px;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><collection /></el-icon></div>系统信息
    </div>
    <div @click="toPublishBlog()" class="box2" :class="{'text-selected':selectItemNum ===2}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><promotion /></el-icon></div>私信信息
    </div>
  </div>

  <!--  <div>-->
  <!--    <el-text style="font-size: 25px;margin: 20px;">我的</el-text>-->
  <!--  </div>-->
  <!--  <div>-->
  <!--    <el-menu default-active="1">-->
  <!--      <el-menu-item index="1" style="margin-top: 20px" @click="toMyBlog()"><el-icon><collection /></el-icon><el-text style="font-size: 18px">我的博客</el-text></el-menu-item>-->
  <!--      <el-menu-item index="2" @click="toPublishBlog()"><el-icon><promotion /></el-icon><el-text style="font-size: 18px">发布内容</el-text></el-menu-item>-->
  <!--      <el-menu-item index="3" @click="toPublishBlog()"><el-icon><cloudy /></el-icon><el-text style="font-size: 18px">云上存储</el-text></el-menu-item>-->
  <!--    </el-menu>-->
  <!--  </div>-->

</template>

<script setup>
import {Cloudy, Collection, Expand, Histogram, Promotion, Refresh, TrendCharts} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter();

const selectItemNum = ref(1)
const toMyBlog = () => {
  selectItemNum.value = 1;
}
const toPublishBlog = () => {
  selectItemNum.value = 2;
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