<template>
  <div style="padding-left: 20px;padding-right: 20px;">
    <div style="border-bottom: rgb(228,231,237) 2px solid;width: 640px;height: 50px;margin-top: 10px" v-for="item in memberSearchStore.searchMemberList" :key="item.id">
  <!--    头像昵称-->
      <div style="display:flex;">
        <div>
          <el-avatar :src="item.avatar"></el-avatar>
        </div>
        <div style="display: flex;align-items: center;margin-left: 10px;width: 470px">
          {{item.nickName}}
        </div>
<!--        操作-->
        <div>
          <el-button style="width: 60px" type="success" plain><el-icon><Plus /></el-icon>关注</el-button>
<!--          <el-button style="width: 60px" type="warning" plain><el-icon><Check /></el-icon>已关注</el-button>-->
          <el-button type="info" plain><el-icon><MoreFilled /></el-icon></el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>


import {onMounted, ref} from "vue";
import {useMemberSearchStore} from "../../../pinia/search/useMemberSearchStore.js";
import {Check, MoreFilled, Plus} from "@element-plus/icons-vue";

const memberSearchStore = useMemberSearchStore()

onMounted(() => {
  memberSearchStore.getMembersBySearch()
})
</script>

<style scoped>

</style>