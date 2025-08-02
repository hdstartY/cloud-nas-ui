<template>
  <div @click="comeBack()" class="clickable-text" style="display: flex; align-items: center; font-size: 20px;height: 36px;width: 60px;margin-left: 10px"><el-icon><arrow-left-bold /></el-icon>返回</div>
  <div>
    <video
        :src="videoPlayStore.oriUrl"
        controls
        autoplay
        muted
        style="width: 680px;height: 383px;background-color: black"
    />
  </div>
  <div style="background-color: white;height: 40px;width: 640px;display: flex;padding-left: 20px;padding-right: 20px;margin-top: 5px">
    <el-avatar :src="videoPlayStore.avatar" />
    <div style="margin-left: 5px;width: 535px">
      <div  style="font-size: 15px;font-weight: 500;" class="nickName-text">{{ videoPlayStore.nickName }}</div>
      <div style="font-size: 12px;color: rgb(147,147,147)">{{ videoPlayStore.createTime }}</div>
    </div>
    <el-button v-if="true" @click="toFollow(item.memberId)" type="success" plain round style="width: 60px;" ><el-icon><plus/></el-icon>关注</el-button>
    <el-button v-if="false" @click="toCancelFollow(item.memberId,item.nickName)" type="warning" plain round style="width: 60px;" ><el-icon><check/></el-icon>已关注</el-button>
  </div>
  <div style="width: 640px;padding-right: 20px;padding-left: 20px;margin-top: 10px">
    {{videoPlayStore.introduce}}
  </div>
  <div style="height: 40px;display: flex;width: 640px;padding-left: 90px;padding-right: 20px;border-bottom: rgba(220, 223, 230, 0.64) 1px solid">
    <div @click="toLike(item)" class="clickable-text" :class="{'clickable-text-selected':false}" style="width: 150px;display: flex;align-items: center">
      <el-icon><Star /></el-icon>点赞 {{videoPlayStore.likeNum}}
    </div>
    <div class="clickable-text" style="width: 150px;display: flex;align-items: center" @click="getComments(item)">
      <el-icon><chat-round/></el-icon>评论 {{videoPlayStore.commentNum}}
    </div>
    <div class="clickable-text" style="width: 150px;display: flex;align-items: center" @click="getComments(item)">
      <el-icon><share/></el-icon>分享
    </div>
    <div class="clickable-text" style="width: 50px;display: flex;justify-content: center;align-items: center" @click="getComments(item)">
      <el-icon><Warning /></el-icon> 举报
    </div>
  </div>

  <!--        发表评论块-->
  <div style="margin-left: 40px;margin-top: 15px">
    <div style=" display: flex;flex-direction: row">
      <div >
        <el-avatar :src="memberStore.avatarUrl" style="font-size: 20px;width: 30px;height: 30px"/>
      </div>
      <div style="margin-left: 8px">
        <el-input @keyup.enter="publishComment()" style="width: 560px;height: 35px;border: skyblue" placeholder="输入你的评论" v-model="commentValue"></el-input>
      </div>
    </div>
    <div style="margin-top: 10px;margin-left: 36px;display: flex;width: 560px;justify-content: space-between">
      <div>
        <div></div>
        <div><el-button style="border: 0px;width: 30px"><el-icon size="20px" style="color:rgb(131, 131, 131);"><camera/></el-icon></el-button></div>
      </div>
      <div>
        <el-button @click="publishComment()" type="primary" round>评论</el-button>
      </div>
    </div>
  </div>
  <!--        评论排序-->
  <div style="margin-top: 10px;;padding: 0 40px">
    <span style="margin-right: 20px" @click="isClicked = isClicked ? isClicked : !isClicked" :class="{'clickable-text-selected':isClicked}" class="clickable-text">按热度</span>
    <span @click="isClicked = !isClicked ? isClicked : !isClicked" :class="{'clickable-text-selected':!isClicked}" class="clickable-text">按时间</span>
  </div>

  <!--        实例评论内容，遍历-->
  <div style=";padding: 0 40px;margin-top: 15px">
    <div v-for="item in videoPlayStore.comments" :key="item.id" style="margin-bottom: 10px">
      <div style="margin-top: 10px;display:flex;flex-direction: row">
        <el-avatar :src="item.avatar" style="font-size: 20px;width: 30px;height: 30px"  class="avatar"/>
        <div style="margin-left: 5px;width: 420px">
          <div style="font-size: 13px;font-weight: 500;color: rgb(64, 158, 255)" class="clickable-text" >{{item.commentNickName}}</div>
          <div style="font-size: 12px;color: rgb(147,147,147)">{{item.createTime}}</div>
        </div>
      </div>
      <div style="font-size: 13px;margin-left: 35px;margin-top: 5px">
        {{item.textContent}}
      </div>
    </div>
    <!-- 加载触发器，占位符，用于触发懒加载 -->
    <div ref="loadMoreRef" v-if="videoPlayStore.hasMore" style="height: 10px;background-color: white"></div>
    <!-- 加载中提示 -->
    <div v-loading="videoPlayStore.loading" element-loading-text="加载中..." v-if="videoPlayStore.hasMore" style="height: 100px;width: 100%;background-color: white"></div>
    <div v-if="!videoPlayStore.hasMore" style="display:flex;align-items: center;justify-content: center;height: 60px;background-color: white">我也是有底线的~</div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {ArrowLeftBold, Camera, ChatRound, Check, Plus, Share, Star, Warning} from "@element-plus/icons-vue";
import {useVideoPlayStore} from "../../../pinia/video/UseVideoPlayStore.js";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {memberInfoShare} from "../../../pinia/member/MemberInfoShare.js";
import {homeBlogStore} from "../../../pinia/honeBlog/HomeBlogShared.js";

const isClicked = ref(true)
const commentValue = ref('')
const memberStore = memberInfoShare()
const router = useRouter()
const videoPlayStore = useVideoPlayStore();

const blogStore = homeBlogStore()
const loadMoreRef = ref(null)
let observer = null;
onMounted(() => {
  // 创建 IntersectionObserver（监听元素进入视口）
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      videoPlayStore.getComments()
    }
  })

  // 开始监听那个 div（只要它出现在屏幕里就触发加载）
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
})

onBeforeUnmount(() => {
  videoPlayStore.reset();
})

const comeBack = () => {
  router.push("/mobileDashboard/video");
}
</script>

<style scoped>
.clickable-text {
  cursor: pointer;
  color: rgba(151, 151, 151);
  transition: color 0.3s;
  font-size: 16px;
  font-weight: 500;
}
.clickable-text:hover {
  color: skyblue;
}
.clickable-text-selected {
  color: skyblue;
}

</style>