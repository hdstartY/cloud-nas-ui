<template>
  <!--  总块-->
  <div style="position: relative;background-color: white">
    <div style="height: 40px; display: flex; flex-direction: row;background-color: white;border-bottom: 1px solid rgba(224,227,232,0.6)">
      <div style="font-size: 20px;padding-left: 10px;padding-top: 5px" @click="comeBack()">
        <div class="clickable-text" style=" font-size: 20px;display: flex;align-items: center"><el-icon><arrow-left-bold /></el-icon>返回</div>
      </div>
      <div style="display: flex;align-items: center;font-size: 20px;margin: 0 auto;padding-right: 80px;">
        {{publisherStore.publisherNickName}}
      </div>
    </div>
    <!--    头像和背景块-->
    <div class="back-img" :style="`background-image: url(${publisherInfo.backImg})`">

    </div>
    <!--    个人信息-->
    <div style="height: 100px;margin-top: 5px;">
      <div style="height: 95px;display: flex;flex-direction: row">
        <div style="padding-left: 20px" >
          <el-avatar style="height: 90px;width: 90px;box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);background-color: white" :src="publisherStore.avatarUrl"></el-avatar>
        </div>
        <div style="padding-left: 10px;display: flex;flex-direction: column;justify-content: center">
          <!--      昵称-->
          <div style="height: 30px;width: 100%;">
            <div style="height: 30px;width: auto;margin: 0 auto">
              <div style="width:100%;display:flex;align-items: center;font-size: 20px">
                {{publisherStore.publisherNickName}}
              </div>
            </div>
          </div>
          <!--      粉丝等-->
          <div style="height: 30px;width: 100%;">
            <div style="margin: 0 auto;height: 30px;display: flex;flex-direction: row;font-size: 15px">
              <div style="height: 100%;align-content: center;margin-right: 10px;" class="text">
                关注: {{ publisherInfo.followCounts }}
              </div>
              <div style="height: 100%;align-content: center;" class="text">
                粉丝: {{ publisherInfo.fanCounts }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      操作-->
      <div v-if="Number(memberStore.memberId) !== Number(publisherStore.publisherId)" style="display: flex;align-items: center;height: 30px;margin-top: 10px">
        <div style="margin: 0 auto">
          <span v-if="!publisherStore.isFollowed"><el-button @click="toFollow" type="success" plain style="width: 315px"><el-icon><plus /></el-icon>关注</el-button></span>
          <span v-if="publisherStore.isFollowed"><el-button @click="toCancelFollow" type="warning" plain style="width: 315px"><el-icon><check /></el-icon>已关注</el-button></span>
          <span style="margin-left: 10px"><el-button @click="toSendMessage()" type="info" plain style="width: 315px"><el-icon><promotion /></el-icon>私信</el-button></span>
        </div>
      </div>
      <!--      个性签名等-->
      <div style="height: 50px;width: 100%;margin-top: 5px;font-size: 14px;color: #424040;padding-left: 20px">
        <div v-if="publisherInfo.signature !== null">个性签名: {{publisherInfo.signature}}</div>
        <div v-if="publisherInfo.signature === null">个性签名: 空空如也~</div>
        <div v-if="publisherInfo.other !== null">其它: {{publisherInfo.other}}</div>
        <div v-if="publisherInfo.other === null">其它: 空空如也~</div>
      </div>
      <!--      内容选项-->
      <div style="width: 100%;height: 40px;display: flex;flex-direction: row;justify-content: space-between;font-size: 16px;border-top: 1px solid rgba(224,227,232,0.6);border-bottom: 1px solid rgba(224,227,232,0.6)">
        <div @click="toMyMessage" class="clickable-text" :class="{'clickable-text-selected':selectItem === 1}" style="width: 340px;text-align: center;padding-top: 10px;border-right: 1px solid rgba(224,227,232,0.6)">
          留言
        </div>
        <div @click="toMyMedia" class="clickable-text" :class="{'clickable-text-selected':selectItem === 2}" style="width: 340px;text-align: center;padding-top: 10px">
          相册
        </div>
      </div>
      <!--      内容-->
      <div style="width: 100%;margin-top: 5px;background-color: white">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ArrowLeftBold, Check, Plus, Promotion} from "@element-plus/icons-vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {publisherMemberIdShare} from "../../../pinia/detail/PublisherMemberIdShare.js";
import mRequest from "../../../utils/MemberRequest.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {memberInfoShare} from "../../../pinia/member/MemberInfoShare.js";
import {followedMembersStore} from "../../../pinia/follow/FollowedMemberIdsShare.js";
import {useChatStore} from "../../../pinia/chat/chatStore.js";

onMounted(() => {
    getPublisherInfo();
})
onBeforeUnmount(() => {
  publisherStore.reset();
})

const publisherStore = publisherMemberIdShare()
const memberStore = memberInfoShare()
const followStore = followedMembersStore()
const chatStore = useChatStore()

const publisherInfo = ref({
  backImg: '',
  fanCounts: '',
  followCounts: '',
  signature: '',
  other: ''
})

const toSendMessage = () => {
  if (memberStore.memberId === '') {
    ElMessage({
      type: 'warning',
      message: "用户未登录"
    })
    router.push("/phoneLogin")
    return;
  }
  chatStore.chatMessages = []
  chatStore.receiveId = publisherStore.publisherId;
  chatStore.receiveNickName = publisherStore.publisherNickName
  chatStore.receiveAvatar = publisherStore.avatarUrl
  chatStore.isCover = true;
  chatStore.currentPage = 1;
  chatStore.hasMore = true;
  router.push("/mobileDashboard/messageDetail")
}

const getPublisherInfo = async () => {
  try {
    const response = await mRequest.get("member/getPublisherInfo", {
      params: {
        memberId: publisherStore.publisherId,
      }
    })
    if (response.data.code === 200) {
      publisherInfo.value = response.data.data
    } else {
      ElMessage({
        type: "warning",
        message: response.data.msg
      })
    }
  } catch (e) {
    ElMessage({
      type: "error",
      message: "未知错误"
    })
    console.log(e.message)
  }
}
const toFollow = async () => {
  if (memberStore.memberId === '') {
    ElMessage({
      type: 'warning',
      message: "用户未登录"
    })
    router.push("/phoneLogin")
    return;
  }
  try {
    const response = await mRequest.get("/follow/toFollow",{
      params: {
        followedId: publisherStore.publisherId,
        followerId: memberStore.memberId
      }
    })
    if (response.data.code === 200) {
      followStore.allFollowedIds.push(publisherStore.publisherId);
      publisherStore.isFollowed = true;
      ElMessage({
        type: 'success',
        message: '关注成功'
      })
    } else {
      ElMessage({
        type: "warning",
        message: "关注失败"
      })
    }
  } catch (e) {
    console.log(e.message)
  }
}
const toCancelFollow = async () => {
  ElMessageBox.confirm(
      `确认取消关注${publisherStore.publisherNickName}吗？`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then( async () => {
    // 用户点击了“确定”
    try {
      const response = await mRequest.get("/follow/toCancelFollow",{
        params: {
          followedId: publisherStore.publisherId,
          followerId: memberStore.memberId
        }
      })
      if (response.data.code === 200) {
        followStore.allFollowedIds = followStore.allFollowedIds.filter(id => id !== publisherStore.publisherId)
        publisherStore.isFollowed = false;
        ElMessage({
          type: 'success',
          message: '取消关注成功'
        })
      } else {
        ElMessage({
          type: "warning",
          message: "取消关注失败"
        })
      }
    } catch (e) {
      ElMessage({
        type: "error",
        message: "未知错误"
      })
      console.log(e.message)
    }
  }).catch(() => {
    // 用户点击了“取消”或关闭了对话框
  })
}

const router = useRouter();
const selectItem = ref(1)
const toMyMessage = () => {
  selectItem.value = 1;
  router.push("/mobileDashboard/publisherInfo/memberLeaveMessage")
}
const toMyMedia = () => {
  selectItem.value = 2;
  router.push("/mobileDashboard/publisherInfo/memberMedia")
}
const comeBack = () => {
  router.back();
}
</script>

<style scoped>
.back-img {
  height: 382px;
  width: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
}

.text {
  color: gray;
  cursor: pointer;
}
.text:hover {
  color: skyblue;
}

.clickable-text {
  cursor: pointer;
  color: rgb(114, 111, 111);
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