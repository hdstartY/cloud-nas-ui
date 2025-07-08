<template>
  <div>
    <div class="message-header">
      信息
    </div>
<!--    系统信息-->
    <div class="system-message-box">
      <div style="margin-right: 480px;height: 100%;display: flex;align-items: center;font-size: 20px;"><el-icon><bell /></el-icon> 系统信息 </div>
      <el-badge :value="400" :max="99"/>
    </div>

<!--    私信信息-->
    <div v-if="PointMessageForm.length > 0" @click="toMessageDetail(item)" class="person-message-box" v-for="item in PointMessageForm" :key="item.memberId">
      <div style="display: flex;width: 600px">
        <div class="person-avatar-box"><el-avatar :src="item.avatar" /></div><div class="person-nickName-box">{{item.nickName}}</div>
      </div>
      <el-badge v-if="item.newsNum > 0" :value="item.newsNum" :max="99"/>
    </div>
  </div>
</template>

<script setup>
import {Bell} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import mRequest from "../../../utils/MemberRequest.js";
import {memberInfoShare} from "../../../pinia/member/MemberInfoShare.js";
import {useRouter} from "vue-router";
import {useChatStore} from "../../../pinia/chat/chatStore.js";
import {ElMessage} from "element-plus";

const memberInfoStore = memberInfoShare()
const chatStore = useChatStore()
const router = useRouter()

onMounted(() => {
  if (memberInfoStore.memberId === '') {
    ElMessage({
      type: 'warning',
      message: "用户未登录"
    })
    router.push("/phoneLogin")
    return;
  }
  getPointMessages();
})

const PointMessageForm = ref([])


const toMessageDetail = (item) => {
  chatStore.chatMessages = []
  chatStore.receiveId = item.memberId;
  chatStore.receiveNickName = item.nickName
  chatStore.receiveAvatar = item.avatar
  chatStore.isCover = true;
  chatStore.currentPage = 1;
  chatStore.hasMore = true;
  chatStore.chatWithId = item.memberId
  router.push("/mobileDashboard/messageDetail")
}
const getPointMessages = async () => {
  try {
    const response = await mRequest.get("/pointMessage/getNotRedMessages",{
      params: {
        memberId: memberInfoStore.memberId
      }
    })
    if (response.data.code === 200) {
      PointMessageForm.value = response.data.data
    } else {
      console.log(response.data.msg)
    }
  } catch (e) {
    console.log(e.message)
  }
}
</script>

<style scoped>
.message-header {
  margin-bottom: 10px;height: 50px;
  width: 100%;
  background-color: skyblue;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: black;
}
.system-message-box {
  cursor: pointer;
  height: 60px;
  border-bottom: 1px solid lightgray;
  border-top: 1px solid lightgray;
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
}
.system-message-box:hover {
  background-color: lightskyblue;
}
.message-num-box {
  height: 20px;
  width: 20px;
  border: 1px solid lightgray;
  font-size: 10px;
  border-radius: 10px;
  background-color: lightcoral;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.person-message-box {
  cursor: pointer;
  display: flex;
  height: 60px;
  border-bottom: 1px solid lightgray;
  align-items: center
}
.person-message-box:hover {
  background-color: lightblue;
}
.person-avatar-box {
  display: flex;
  margin-left: 20px
}
.person-nickName-box {
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>