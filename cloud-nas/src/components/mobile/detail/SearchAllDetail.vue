<template>
  <div style="padding-left: 20px;padding-right: 20px">
    <div v-if="allSearchStore.searchBlogList"
         class="post-card"
         v-for="item in allSearchStore.searchBlogList"
         :key="item.id"
    >
      <!-- 用户信息 -->
      <div class="user-info">
        <el-avatar :src="item.avatar"/>
        <div style="margin-left: 5px;width: 460px">
          <div @click="toPublisherDetail(item)" style="font-size: 15px;font-weight: 500;" class="nickName-text">{{ item.nickName }}</div>
          <div style="font-size: 12px;color: rgb(147,147,147)">{{ item.createTime }}</div>
        </div>
        <el-button v-if="!(allFollowedSet.has(item.memberId)) && !(Number(item.memberId) === Number(memberStore.memberId))" @click="toFollow(item.memberId)" type="success" plain round style="width: 60px;margin-left: 80px" ><el-icon><Plus/></el-icon>关注</el-button>
        <el-button v-if="(allFollowedSet.has(item.memberId)) && !(Number(item.memberId) === Number(memberStore.memberId))" @click="toCancelFollow(item.memberId,item.nickName)" type="warning" plain round style="width: 60px;margin-left: 80px" ><el-icon><Check/></el-icon>已关注</el-button>
      </div>

      <!-- 文字内容 -->
      <div class="message-content" style="color: rgb(51, 51, 51)">
        {{ item.textContent }}
      </div>

      <!-- 图片内容 -->
      <div class="img-content" v-if="item.images && item.images.length">
        <el-image
            v-for="(img, index) in item.images"
            :key="index"
            :src="img"
            class="post-image"
            fit="cover"
            :preview-src-list="item.images"
            :initial-index="index"
            preview-teleported
        />
      </div>
      <div @click="toBlogDetailPage(item)" class="clickable-text" style="display: flex;justify-content: center;align-items: center;width: 640px;height: 24px;margin-top: 5px">
        查看详情<el-icon><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {followedMembersStore} from "../../../pinia/follow/FollowedMemberIdsShare.js";
import {memberInfoShare} from "../../../pinia/member/MemberInfoShare";
import {ArrowRight, ChatRound, Check, Operation, Plus, Star} from "@element-plus/icons-vue";
import {useAllSearchStore} from "../../../pinia/search/useAllSearchStore.js";

const allSearchStore = useAllSearchStore()
const followedStore = followedMembersStore()
const memberStore = memberInfoShare()
const allFollowedSet = computed(() => new Set(followedStore.allFollowedIds))

onMounted(() => {
  allSearchStore.getAllBySearch();
})
onBeforeUnmount(() => {

})
const toFollow = (memberId) => {

}
const toCancelFollow = (memberId) => {

}
const toPublisherDetail = (item) => {

}

const toBlogDetailPage = (item) => {

}

</script>

<style scoped>
.post-card {
  margin-top: 20px;
  padding-bottom: 10px;
  border-bottom: rgb(228,231,237) 2px solid;
}
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.message-content {
  margin: 10px 0;
  font-size: 14px;
  line-height: 1.6;
}
.img-content {
  gap: 10px;
  margin-top: 10px;
}
.post-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 5px;
}
.action-bar {
  padding-left: 40px;
  padding-right: 40px;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
}
.clickable-text {
  cursor: pointer;
  color: rgba(151, 151, 151);
  transition: color 0.3s;
  font-size: 14px;
  font-weight: 500;
}
.clickable-text:hover {
  border: none;
  outline: none;
  color: skyblue;
}
.clickable-text-selected {
  color: skyblue;
}
.normal-text {
  color: rgba(151, 151, 151);
  transition: color 0.3s;
  font-size: 14px;
  font-weight: 500;
}
</style>