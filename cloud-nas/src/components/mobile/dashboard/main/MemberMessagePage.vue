<template>
  <div class="chat-container">
    <div class="chat-header">
      <div @click="comeBack()" class="clickable-text" style="display:flex;align-items: center;justify-content: center">
        <el-icon><ArrowLeftBold /></el-icon>返回
      </div>
      <div>
        {{chatStore.receiveNickName}}
        <div v-if="chatStore.receiveStatus" style="font-size: 10px;color: greenyellow">在线</div>
        <div v-if="!chatStore.receiveStatus" style="font-size: 10px;color: red">离线</div>
      </div>
      <div style="width: 60px"></div>
    </div>
    <div class="chat-messages" ref="chatContainerRef">
      <!-- 加载触发器，占位符，用于触发懒加载 -->
      <div ref="loadMoreRef" v-if="chatStore.hasMore" style="height: 1px;"></div>
      <div style="display:flex;align-items: center;margin-top: 10px;width: 100%" v-for="item in chatStore.chatMessages">
        <div style="display: flex" v-if="Number(item.sendId) === Number(chatStore.receiveId)">
          <div style="margin-right: 10px" v-if="Number(item.sendId) === Number(chatStore.receiveId)">
            <el-avatar shape="square"  :src="chatStore.receiveAvatar"/>
          </div>
          <div>
            <div v-if="item.status === 0" class="message-box">
              {{item.message}}
            </div>
            <div style="background-color: rgba(255,255,255,0)" v-if="item.status === 1" class="message-box-for-me">
              <el-image
                  style="width: 200px; height: auto;border-radius: 5px"
                  :src="item.message"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  show-progress
                  :initial-index="4"
                  fit="cover"
                  :preview-src-list="[item.message]"
                  :lazy="true"
              />
            </div>
          </div>
        </div>
        <div style="display: flex;width: 638px;justify-content: flex-end" v-if="Number(item.sendId) === Number(memberInfoStore.memberId)">
          <div>
            <div v-if="item.status === 0" class="message-box-for-me">
              {{item.message}}
            </div>
            <div style="background-color: rgba(255,255,255,0)" v-if="item.status === 1" class="message-box-for-me">
              <el-image
                  style="width: 200px; height: auto;border-radius: 5px"
                  :src="item.message"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  show-progress
                  :initial-index="4"
                  fit="cover"
                  :preview-src-list="[item.message]"
                  :lazy="true"
              />
            </div>
          </div>
          <div style="margin-left: 10px" v-if="Number(item.sendId) === Number(memberInfoStore.memberId)">
            <el-avatar shape="square"  :src="memberInfoStore.avatarUrl"/>
          </div>
        </div>
<!--        <div style="margin-right: 10px" v-if="Number(item.sendId) === Number(chatStore.receiveId)">-->
<!--          <el-avatar  :src="chatStore.receiveAvatar"/>-->
<!--        </div>-->
<!--        <div>-->
<!--          <div class="message-box" :class="{'message-box-for-me' : Number(item.sendId) === Number(memberInfoStore.memberId)}">-->
<!--            {{item.message}}-->
<!--          </div>-->
<!--        </div>-->
<!--        <div style="margin-left: 10px" v-if="Number(item.sendId) === Number(memberInfoStore.memberId)">-->
<!--          <el-avatar  :src="memberInfoStore.avatarUrl"/>-->
<!--        </div>-->
      </div>
    </div>
    <div class="chat-input">
      <el-input
          type="text"
          v-model="messageInput"
          @keyup.enter="sendMessage"
          placeholder="输入消息..."
          style="height: 42px;width: 530px"
          @focus="scrollToBottomByInput"
          :autosize="true"
      />
      <div style="height: 100%;margin: 0 5px;display: flex;align-items: center">
        <el-button @click="isShowOtherChoice = !isShowOtherChoice" :icon="Plus" circle />
      </div>
      <div style="display: flex;align-items: center">
        <el-button style="height: 38px;width: 75px" @click="sendMessage"  type="success">发送</el-button>
      </div>
    </div>
    <el-collapse-transition>
      <div v-if="isShowOtherChoice" style="height: 150px;background-color: rgba(220, 223, 230, 0.64)">
        <div style="display:flex; width: 100%;background-color: white;">
          <div style="height: 50px;padding-left: 20px">
            <el-button circle :icon="Plus"></el-button>
          </div>
<!--          <div style="height: 50px;padding-left: 20px">-->
<!--            <el-button circle :icon="Apple"></el-button>-->
<!--          </div>-->
        </div>
          <div @click="sendPicture = !sendPicture" style="border-radius: 10px;margin-left: 20px;margin-top: 20px;width: 60px;height: 60px;background-color: white;display: flex;align-items: center;justify-content: center">
            <el-icon size="40"><Picture /></el-icon>
          </div>
        </div>
    </el-collapse-transition>
  </div>
  <el-dialog v-model="sendPicture" title="发送图片" width="660" :draggable="true" style="">
    <div style="color:red;margin-bottom: 10px">注意：单张图片大小不可超过10mb，最多一次性发送12张图片</div>
    <div style="">
      <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          v-model:file-list="fileList"
          :on-change="handChange"
          :multiple="true"
          :limit="12"
      >
        <el-icon><Plus /></el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
          </div>
        </template>
      </el-upload>

      <el-dialog v-model="dialogVisible" width="60%">
        <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%; max-height: 80vh; object-fit: contain;" />
      </el-dialog>
    </div>
    <div style="text-align: center;margin-top: 20px">
      <el-button  @click="sendPicture = false">取消</el-button>
      <el-button @click="sendImg" type="success" :disabled="sendDisabled">发送</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {ref, onMounted, onUnmounted, onBeforeUnmount,watch,nextTick,toRefs} from 'vue';
import {useChatStore} from "../../../../pinia/chat/chatStore.js";
import wRequest from "../../../../utils/WebRequest.js";
import {memberInfoShare} from "../../../../pinia/member/MemberInfoShare.js";
import {ArrowLeftBold, Apple, Plus, Delete, Download, ZoomIn, Picture} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import 'element-plus/es/components/collapse-transition/style/css'
import mRequest from "../../../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";

const sendPicture = ref(false)
const sendDisabled = ref(false)

//文件上传
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const fileList = ref([])
const handleRemove = (file) => {
  fileList.value = fileList.value.filter(f => f.uid !== file.uid)
  console.log(fileList.value)
}
const handChange = (uploadFIle,uploadFiles) => {
  fileList.value = uploadFiles
  console.log(fileList.value)
}
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const handleDownload = (file) => {
  console.log(file)
}

const cooldown = ref(false)
const cooldownTime = ref(0)
let cooldownTimer = null
const sendImg = async () => {

  if (cooldown.value) {
    ElMessage({
      type: 'warning',
      message: cooldownTime.value + "秒后可再次发送"
    })
    return
  };

  if (fileList.value.length <= 0) {
    ElMessage({
      type: 'warning',
      message: "发送列表不能为空"
    })
    return;
  }

  const formData = new FormData()
  // 添加图片文件
  fileList.value.forEach((file) => {
    formData.append('images', file.raw)  // 后端用 @RequestParam("images")
  })
  //发请求
  try {
    sendDisabled.value = true;
    const response = await mRequest.post('/pointMessage/uploadImg', formData)
    if (response.data.code === 200 && response.data.data.length > 0) {
      ElMessage({
        type: "success",
        message: "图片发送成功"
      })
      response.data.data.forEach(item => {
        chatStore.sendMessage(item,1)
      })
      sendDisabled.value = false;
      fileList.value = []
      sendPicture.value = false;

      // 启动冷却（比如 10 秒）
      cooldown.value = true
      cooldownTime.value = 10

      cooldownTimer = setInterval(() => {
        cooldownTime.value--
        if (cooldownTime.value <= 0) {
          cooldown.value = false
          clearInterval(cooldownTimer)
        }
      }, 1000)
    }else {
      sendDisabled.value = false
      ElMessage({
        type: "error",
        message: response.data.data.msg
      })
    }
  } catch (e) {
    sendDisabled.value = false;
    console.log(e.message)
  }
}

const chatStore = useChatStore();
const chatContainerRef = ref(null);
const messageInput = ref('');
const memberInfoStore = memberInfoShare()
const router = useRouter()
const isShowOtherChoice = ref(false)
const closeOtherChoice = () => {
  isShowOtherChoice.value = false
}

const loadMoreRef = ref(null)
let observer = null;
onMounted(() => {
  // 创建 IntersectionObserver（监听元素进入视口）
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      chatStore.getHistoryChat();
    }
  })
  // 开始监听那个 div（只要它出现在屏幕里就触发加载）
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
  getReceiveStatus()
  waitDomAndScroll();
  scrollToBottom()
  console.log(isShowOtherChoice.value)
});

onBeforeUnmount(() => {
  // 页面销毁前停止监听
  if (loadMoreRef.value && observer) {
    observer.unobserve(loadMoreRef.value)
  }
  chatStore.reset()
})
// 监听 chatMessages 数组变化
watch(
    () => chatStore.chatMessages,
    async () => {
      await nextTick();
      const el = chatContainerRef.value;
      if (el.scrollTop === el.scrollHeight) {
        scrollToBottom();
      }
    },
);
const waitDomAndScroll = async () => {
  // DOM 更新后再滚动
  await nextTick();
  scrollToBottom();
}
// 滚动到底部函数
function scrollToBottom() {
  const el = chatContainerRef.value;
  if (el) {
    console.log("触发滚动")
    el.scrollTop = el.scrollHeight;
  }
}
function scrollToBottomByInput() {
  isShowOtherChoice.value = true;
  const el = chatContainerRef.value;
  if (el) {
    console.log("触发滚动")
    el.scrollTop = el.scrollHeight;
  }
}
const sendMessage = () => {
  if (messageInput.value.trim()) {
    chatStore.sendMessage(messageInput.value,0);
    messageInput.value = '';
    waitDomAndScroll();
  }
};


onUnmounted(() => {
  // chatStore.disconnect();
});

const comeBack = () => {
  router.back();
}

const getReceiveStatus = async () => {
  try {
    const response = await wRequest.get("/chat/getStatus",{
      params: {
        receiveId: chatStore.receiveId
      }
    })
    if (response.data.code === 200) {
      chatStore.receiveStatus = response.data.data
    } else {
      console.log(response.data.msg)
    }
  } catch (e) {
    console.log(e.message)
  }
}


</script>

<style scoped>
.el-upload--picture-card {
  width: 100px;
  height: 100px;
}

.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}

.el-upload-list__item-thumbnail {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.upload-text {
  cursor: pointer;
}
.upload-text:hover {
  color: skyblue;
}
.message-box {
  background-color: white;
  min-height: 40px;
  max-width: 540px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 2px 5px;
}
.message-box-for-me {
  min-height: 40px;
  max-width: 540px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 2px 5px;
  background-color: lightgreen;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.chat-header {
  background-color: white;
  color: black;
  padding: 1rem;
  height: 40px;
  text-align: center;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}

.chat-messages {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: rgba(220, 223, 230, 0.64);
}

.chat-input {
  display: flex;
  padding: 20px;
  background-color: white;
}

.chat-input input {
  flex: 1;
  padding: 0.5rem;
  margin-right: 1rem;
  border: none;
  border-radius: 4px;
}


.clickable-text {
  cursor: pointer;
  color: gray;
  transition: color 0.3s;
  font-size: 20px;
  font-weight: 500;
}
.clickable-text:hover {
  color: lightskyblue;
}
</style>
