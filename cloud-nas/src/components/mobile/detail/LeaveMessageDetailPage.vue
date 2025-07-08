<template>
  <!--  根据状态显示评论框-->
  <div style="width: 100%;padding-left: 20px;margin-top: 5px">
    <div style=" display: flex;flex-direction: row;width: 100%">
      <div >
        <el-avatar :src="memberStore.avatarUrl" style="font-size: 20px;width: 30px;height: 30px"/>
      </div>
      <div style="margin-left: 8px">
        <el-input v-model="commentValue" style="width: 590px;height: 35px;border: skyblue" placeholder="输入你的留言"></el-input>
      </div>
    </div>
    <div style="margin-top: 10px;margin-left: 36px;display: flex;width: 590px;justify-content: space-between">
      <div>
        <div></div>
        <div><el-button style="border: 0px;width: 30px"><el-icon size="20px" style="color:rgb(131, 131, 131);"><camera/></el-icon></el-button></div>
      </div>
      <div>
        <el-button @click="publishComment()" type="primary" round>评论</el-button>
      </div>
    </div>
  </div>
<!--    空白留言显示-->
  <div v-if="leaveMsgStore.leaveMessageForm.length === 0" style="font-size: 20px;text-align: center;padding-top: 30px;color:skyblue;">
    <div v-if="!(memberStore.memberId !== publisherStore.publisherId)">当前没有人给你留言哦~</div>
    <div v-if="memberStore.memberId !== publisherStore.publisherId">空空如也~</div>
  </div>
<!--  留言展示-->
  <div v-if="leaveMsgStore.leaveMessageForm.length > 0" v-for="comment in leaveMsgStore.leaveMessageForm" :key="comment.id">
    <div style="padding-left: 20px;padding-right: 20px;background-color: white" >
      <div style="margin-top: 10px;display:flex;flex-direction: row;padding-top: 10px;padding-bottom: 10px;border-top: 1px solid rgba(224,227,232,0.6)">
        <el-avatar v-if="comment.avatar" :src="comment.avatar" style="font-size: 20px;width: 40px;height: 40px"  class="avatar"/>
        <div style="margin-left: 10px;width: 420px">
          <div style="font-size: 13px;font-weight: 500;color: rgb(64, 158, 255)" class="clickable-text" @click="reply(comment,item)">{{ comment.messageNickName }}</div>
          <div style="font-size: 12px;color: rgb(147,147,147)">{{ comment.createTime }}</div>
        </div>
      </div>
      <div style="font-size: 13px;margin-left: 50px;width: 580px">
        {{comment.textContent}}
      </div>
    </div>
  </div>
  <div style="height: 20px;background-color: white"></div>
  <!-- 加载中提示 -->
  <!-- 加载触发器，占位符，用于触发懒加载 -->
  <div ref="loadMoreRef" v-if="leaveMsgStore.hasMore" style="height: 10px;background-color: white"></div>
  <div v-loading="leaveMsgStore.leaveMsgLoading" element-loading-text="加载中..." v-if="leaveMsgStore.hasMore" style="height: 100px;width: 100%;background-color: white"></div>
  <div v-if="!leaveMsgStore.hasMore && leaveMsgStore.leaveMessageForm.length !== 0" style="display:flex;align-items: center;justify-content: center;height: 60px;background-color: white">我也是有底线的~</div>
</template>

<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import {Camera} from "@element-plus/icons-vue";
import {memberInfoShare} from "../../../pinia/member/MemberInfoShare.js";
import {publisherMemberIdShare} from "../../../pinia/detail/PublisherMemberIdShare.js";
import mRequest from "../../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {useLeaveMsgStore} from "../../../pinia/detail/UseLeaveMsgStore.js";

const memberStore = memberInfoShare()
const publisherStore = publisherMemberIdShare()
const router = useRouter();
const leaveMsgStore = useLeaveMsgStore()


const loadMoreRef = ref(null)
let observer = null;
onMounted(() => {
  // 创建 IntersectionObserver（监听元素进入视口）
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      leaveMsgStore.getLeaveMessage();
    }
  })

  // 开始监听那个 div（只要它出现在屏幕里就触发加载）
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
})

onBeforeUnmount(() => {
  leaveMsgStore.reset()
})

const leaveMessageForm = ref([

])

const getLeaveMessage = async () => {
  try {
    const response = await mRequest.get("/leave/listLeaveMessage",{
      params: {
        memberId: publisherStore.publisherId,
      }
    })
    if (response.data.code === 200) {
      leaveMessageForm.value = response.data.data
    } else {
      console.log(response.data.msg)
    }
  } catch (e) {
    console.log(e.message)
  }
}

const commentValue = ref('')
const publishComment = async () => {
  if (memberStore.memberId === '') {
    ElMessage({
      type: 'warning',
      message: "用户未登录"
    })
    router.push("/phoneLogin")
    return;
  }
  if (commentValue.value === '') {
    ElMessage({
      type: 'error',
      message: '评论内容不能为空'
    })
  }else {
    try {
      const response = await mRequest.get("/leave/leaveMessage",{
        params: {
          leaveId: memberStore.memberId,
          memberId: publisherStore.publisherId,
          textContent: commentValue.value
        }
      })
      if (response.data.code === 200) {
        getLeaveMessage();
        ElMessage({
          type: 'success',
          message: '评论成功'
        })
        //刷新评论区数据
        commentValue.value = ''
      } else {
        console.log(response.data.msg)
      }
    } catch (e) {
      console.log(e.message)
    }
  }
}
</script>

<style scoped>

</style>