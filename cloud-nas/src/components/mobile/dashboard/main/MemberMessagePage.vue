<template>
  <div class="chat-container">
    <div class="chat-header">
      <div @click="comeBack()" class="clickable-text" style="display:flex;align-items: center;"><el-icon><ArrowLeftBold /></el-icon>返回</div>
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
            <el-avatar  :src="chatStore.receiveAvatar"/>
          </div>
          <div>
            <div class="message-box">
              {{item.message}}
            </div>
          </div>
        </div>
        <div style="display: flex;width: 638px;justify-content: flex-end" v-if="Number(item.sendId) === Number(memberInfoStore.memberId)">
          <div>
            <div class="message-box-for-me">
              {{item.message}}
            </div>
          </div>
          <div style="margin-left: 10px" v-if="Number(item.sendId) === Number(memberInfoStore.memberId)">
            <el-avatar  :src="memberInfoStore.avatarUrl"/>
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
          style="height: 45px;width: 570px"
          @focus="scrollToBottom"
      />
      <el-button style="height: 45px;width: 75px" type="success" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, onBeforeUnmount,watch,nextTick,toRefs} from 'vue';
import {useChatStore} from "../../../../pinia/chat/chatStore.js";
import wRequest from "../../../../utils/WebRequest.js";
import {memberInfoShare} from "../../../../pinia/member/MemberInfoShare.js";
import {ArrowLeftBold, Burger} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";

const chatStore = useChatStore();
const chatContainerRef = ref(null);
const messageInput = ref('');
const memberInfoStore = memberInfoShare()
const router = useRouter()

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
const sendMessage = () => {
  if (messageInput.value.trim()) {
    chatStore.sendMessage(messageInput.value);
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
  background-color: skyblue;
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
  background-color: #f5f5f5;
}

.chat-input {
  display: flex;
  padding: 1rem;
  background-color: skyblue;
}

.chat-input input {
  flex: 1;
  padding: 0.5rem;
  margin-right: 1rem;
  border: none;
  border-radius: 4px;
}

.chat-input button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #45a049;
}

.clickable-text {
  cursor: pointer;
  color: rgb(32, 28, 29);
  transition: color 0.3s;
  font-size: 20px;
  font-weight: 500;
}
.clickable-text:hover {
  color: lightgrey;
}
</style>
