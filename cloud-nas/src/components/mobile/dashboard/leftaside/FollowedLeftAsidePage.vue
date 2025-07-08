<template>
  <div>
    <!--    文字-->
    <div style="font-size: 30px;padding-left: 20px;margin-top: 10px;">
      关注
    </div>
    <!--    切换按钮-->
    <div @click="toNew()" class="box2" :class="{'text-selected':selectItemNum ===1}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px;margin-top: 30px">
      <div style="display: flex;align-items: center"><el-icon><refresh /></el-icon></div>最新
    </div>
    <div @click="toHotPoint()" class="box2" :class="{'text-selected':selectItemNum ===2}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><trend-charts /></el-icon></div>热度
    </div>
  </div>
</template>

<script setup>
import {Refresh, TrendCharts} from "@element-plus/icons-vue";
import {ref} from "vue";
import {followedMembersStore} from "../../../../pinia/follow/FollowedMemberIdsShare.js";

const followedStore = followedMembersStore()

const selectItemNum = ref(1)
const toNew = () => {
  followedStore.currentPage = 1;
  selectItemNum.value = 1
  followedStore.followedSortField = 'b.create_time'
}
const toHotPoint = () => {
  followedStore.currentPage = 1;
  selectItemNum.value = 2;
  followedStore.followedSortField = 'b.like_num'
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