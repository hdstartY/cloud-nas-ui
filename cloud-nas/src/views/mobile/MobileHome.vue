<template>
  <div class="main-layout">
    <div class="left-layout" >
      <div style="display: flex;flex-direction: column;align-items: center">
        <div style="margin: 0 auto;font-size: 60px">Cloud-NAS</div>
        <div @click="toMobileDashboard()" style="display:flex;align-items: center;" class="toHome"><el-icon><HomeFilled /></el-icon>去主页</div>
      </div>
    </div>

    <div class="right-layout">
      <router-view></router-view>
    </div>
  </div>
</template>


<script setup>
import {reactive} from "vue";
import {useRouter} from "vue-router";
import {HomeFilled} from "@element-plus/icons-vue";

const form = reactive({
  phone: '',
  password: '',
})

const router = useRouter()
const toMobileDashboard = () => {
  router.push("/mobileDashboard")
}

</script>

<style scoped>
.main-layout {
  background-color: rgba(220, 223, 230, 0.64);;
  display: flex;
  width: 100vw;
  height: 100vh;
}
.left-layout {
  background-color: rgba(220, 223, 230, 0.64);;
  width: 55%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.right-layout {
  background-color: rgba(220, 223, 230, 0.64);;
  display: flex;
  align-items: center;
  width: 45%;
  height: 100%
}

.toHome {
  cursor: pointer;
}
.toHome:hover{
  color: skyblue;
}
</style>