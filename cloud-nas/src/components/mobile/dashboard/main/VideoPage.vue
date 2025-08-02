<template>
<!--  总块-->
  <div style="display: flex;flex-wrap: wrap;width: 680px;gap: 10px;background-color: rgba(220, 223, 230, 0.64);" v-for="item in videoList" :key="item.id">
    <div style="display: flex;margin-bottom: 5px;background-color: white;width: 680px;height: 190px;padding-left: 20px;padding-right: 20px;padding-top: 5px">
<!--      预览图-->
      <div @click="toPlayVideo(item)" style="position: relative;cursor: pointer">
        <img
            class="post-image video-thumb"
            :src="item.preImg"
            style="transition: transform 0.3s ease;"
        >
        <span class="video-icon">▶</span>
      </div>
<!--      介绍-->
      <div style="width: 310px;margin-left: 10px;">
        <div style="background-color: white;height: 100px;color: black">
          {{item.introduce}}
        </div>
        <div style="height: 40px;display: flex;">
          <div @click="toLike(item)" class="clickable-text" :class="{'clickable-text-selected':item.isLike}" style="width: 120px;display: flex;align-items: center">
            <el-icon><Star /></el-icon>点赞 {{item.likeNum}}
          </div>
          <div class="clickable-text" style="width: 120px;display: flex;align-items: center" @click="getComments(item)" :class="{'clickable-text-selected':item.isShowComment}">
            <el-icon><chat-round/></el-icon>评论 {{item.commentNum}}
          </div>
          <div class="clickable-text" style="width: 50px;display: flex;justify-content: center;align-items: center" @click="getComments(item)" :class="{'clickable-text-selected':item.isShowComment}">
            <el-icon><Warning /></el-icon> 举报
          </div>
        </div>
        <div style="background-color: white;height: 40px;display: flex">
          <el-avatar :src="item.avatar" />
          <div style="margin-left: 5px;width: 150px">
            <div  style="font-size: 15px;font-weight: 500;" class="nickName-text">{{ item.nickName }}</div>
            <div style="font-size: 12px;color: rgb(147,147,147)">{{ item.createTime }}</div>
          </div>
          <el-button v-if="!(allFollowedSet.has(item.memberId)) && !(Number(item.memberId) === Number(memberInfoStore.memberId))" @click="toFollow(item.memberId)" type="success" plain round style="width: 60px;" ><el-icon><plus/></el-icon>关注</el-button>
          <el-button v-if="(allFollowedSet.has(item.memberId)) && !(Number(item.memberId) === Number(memberInfoStore.memberId))" @click="toCancelFollow(item.memberId,item.nickName)" type="warning" plain round style="width: 60px;" ><el-icon><check/></el-icon>已关注</el-button>
          <div v-if="(Number(item.memberId) === Number(memberInfoStore.memberId))" style="width: 70px"></div>
          <el-button type="info" round plain><el-icon><share /></el-icon></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {followedMembersStore} from "../../../../pinia/follow/FollowedMemberIdsShare.js";
import {memberInfoShare} from "../../../../pinia/member/MemberInfoShare.js";
import {ChatRound, Check, Plus, Share, Star, Warning} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {useVideoPlayStore} from "../../../../pinia/video/UseVideoPlayStore.js";

const router = useRouter()
const videoPlayStore = useVideoPlayStore()

const memberInfoStore = memberInfoShare()
const videoList = ref([
    {
      id: 0,
      preImg: 'http://122.152.237.135:9000/cloud-nas/2025/07/28/video_pre/40bd997b193843d7bf5e19ba08107a92-169239d1746140c51de8b0e9b7516885_raw.jpeg',
      oriUrl: 'http://122.152.237.135:9000/cloud-nas/2025/07/29/video/e5b5371d5e484402bf4e80bef7250da9-2025-07-29_122820_184.mp4',
      introduce: '这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是',
      memberId: 2,
      likeNum: 23,
      commentNum: 34,
      createTime: '2025-07-08 00:00:00',
      avatar: 'http://122.152.237.135:9000/cloud-nas/2025/07/10/avator/b7a008d91e4547ab8dec8298f17156eb-20211031071558_a8394.jpg',
      nickName: '浩浩',
    },
  ])
const followedStore = followedMembersStore()
const allFollowedSet = computed(() => new Set(followedStore.allFollowedIds))

const toPlayVideo = (item) => {
  videoPlayStore.id = item.id
  videoPlayStore.oriUrl = item.oriUrl
  videoPlayStore.introduce = item.introduce
  videoPlayStore.memberId = item.memberId
  videoPlayStore.likeNum = item.likeNum
  videoPlayStore.commentNum = item.commentNum
  videoPlayStore.createTime = item.createTime
  videoPlayStore.avatar = item.avatar
  videoPlayStore.nickName = item.nickName
  router.push("/mobileDashboard/videoPlay")
}
</script>

<style scoped>
.nickName-text {
  cursor: pointer;
  color: rgb(51, 51, 51);
  transition: color 0.3s;
  font-size: 14px;
  font-weight: 500;
}
.nickName-text:hover {
  color: skyblue;
}
.video-icon {
  position: absolute;
  font-size: 28px;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.post-image {
  width: 320px;
  height: 180px;
  object-fit: cover;
  border-radius: 6px;
}
.video-thumb {
  filter: brightness(0.7);
}
.post-image.video-thumb:hover {
  transform: scale(1.05); /* 放大1.05倍，可以根据需要调整 */
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
</style>