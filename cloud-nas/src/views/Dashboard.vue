<template>
<!--  总块-->
  <div class="main-dashboard">
<!--    头-->
    <div class="header-dashboard">
      Cloud-NAS后台管理
    </div>
<!--    身子-->
    <div style="display: flex;">
      <!--    左侧导航-->
      <div class="left-nav">
        <div @click="toCheck" class="nav-item nav-item-select" :class="{'nav-item-selected' : navSelect === 1}"><el-icon><Filter /></el-icon>内容审核</div>
        <div @click="toReport" class="nav-item nav-item-select" :class="{'nav-item-selected' : navSelect === 2}"><el-icon><WalletFilled /></el-icon>举报管理</div>
        <div @click="toUerInfo" class="nav-item nav-item-select" :class="{'nav-item-selected' : navSelect === 3}"><el-icon><Avatar /></el-icon>用户管理</div>
      </div>
<!--      内容-->
      <div class="content-dashboard">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script setup>
import {Avatar, Checked, Filter, WalletFilled} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useRouter} from "vue-router";

const navSelect = ref(1)
const router = useRouter()

const toCheck = () => {
  navSelect.value = 1;
  router.push("/dashboard/checkBlog")
}
const toReport = () => {
  navSelect.value = 2;
  router.push("/dashboard/report")
}
const toUerInfo = () => {
  navSelect.value = 3;
  router.push("/dashboard/userInfo")
}
</script>

<style scoped>
.main-dashboard {
  height: 100vh;
  width: 100vw;
  background-color: rgba(220, 223, 230, 0.64);;
}
.header-dashboard {
  position: fixed;
  background-color: white;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  z-index: 9999;
}
.left-nav {
  position: fixed;
  background-color: white;
  width: 200px;
  height: calc(100vh - 85px);
  margin-top: 85px;
}
.content-dashboard {
  background-color: white;
  width: calc(100vw - 205px);
  height: calc(100vh - 85px);
  margin-top: 85px;
  margin-left: 205px;
}
.nav-item {
  height: 80px;
  width: 100%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.nav-item-select {
  color: #888888;
  cursor: pointer;
}
.nav-item-select:hover {
  color: skyblue;
}
.nav-item-selected {
  color: skyblue;
}
</style>