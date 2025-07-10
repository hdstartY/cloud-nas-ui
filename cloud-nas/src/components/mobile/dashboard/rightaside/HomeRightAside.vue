<template>
  <div v-if="blogStore.selectItem !== 3">
    <!--    文字-->
    <div style="font-size: 25px;padding-left: 20px;margin-top: 10px;display: flex;align-items: center;">
      <el-icon><DCaret /></el-icon>操作
    </div>
    <!--    切换按钮-->
    <div @click="resetPageNum" class="box2" style="font-size: 20px;display: flex;flex-direction: row;margin-top: 30px;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><RefreshLeft /></el-icon></div>重置
    </div>
    <div @click="" class="box2" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><Top /></el-icon></div>顶部
    </div>
    <div @click="" class="box2" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><Bottom /></el-icon></div>底部
    </div>
  </div>

  <div v-if="blogStore.selectItem === 3">
    <!--    文字-->
    <div style="font-size: 25px;padding-left: 20px;margin-top: 10px;display: flex;align-items: center;">
      <el-icon><Operation /></el-icon>分类
    </div>
    <!--    切换按钮-->
    <div @click="" class="box2" :class="{'text-selected':selectItemNum ===1}" style="font-size: 20px;display: flex;flex-direction: row;margin-top: 30px;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><HelpFilled /></el-icon></div>日常
    </div>
    <div @click="" class="box2" :class="{'text-selected':selectItemNum ===2}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><Top /></el-icon></div>体育
    </div>
    <div @click="" class="box2" :class="{'text-selected':selectItemNum ===3}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><Bottom /></el-icon></div>新闻
    </div>
    <div @click="" class="box2" :class="{'text-selected':selectItemNum ===3}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><Bottom /></el-icon></div>娱乐
    </div>
    <div @click="" class="box2" :class="{'text-selected':selectItemNum ===3}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><Bottom /></el-icon></div>生活
    </div>
    <div @click="" class="box2" :class="{'text-selected':selectItemNum ===3}" style="font-size: 20px;display: flex;flex-direction: row;padding-left: 20px">
      <div style="display: flex;align-items: center"><el-icon><Bottom /></el-icon></div>其他
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {homeBlogStore} from "../../../../pinia/honeBlog/HomeBlogShared.js";
import {Bottom, DCaret, HelpFilled, Operation, RefreshLeft, Top} from "@element-plus/icons-vue";

const router = useRouter();
const blogStore = homeBlogStore()

const selectItemNum = ref(1)

const resetPageNum = () => {

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