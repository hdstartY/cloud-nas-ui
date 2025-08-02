<template>
  <div style="padding-left: 20px;padding-right: 20px">
    <div v-if="blogSearchStore.searchBlogList"
         class="post-card"
         v-for="item in blogSearchStore.searchBlogList"
         :key="item.id"
    >
      <!-- 用户信息 -->
      <div class="user-info">
        <el-avatar :src="item.avatar"/>
        <div style="margin-left: 5px;width: 460px">
          <div @click="toPublisherDetail(item)" style="font-size: 15px;font-weight: 500;" class="nickName-text">{{ item.nickName }}</div>
          <div style="font-size: 12px;color: rgb(147,147,147)">{{ item.createTime }}</div>
        </div>
        <el-button v-if="!(allFollowedSet.has(Number(item.memberId))) && !(Number(item.memberId) === Number(memberStore.memberId))" @click="toFollow(item.memberId)" type="success" plain round style="width: 60px;margin-left: 80px" ><el-icon><Plus/></el-icon>关注</el-button>
        <el-button v-if="(allFollowedSet.has(Number(item.memberId))) && !(Number(item.memberId) === Number(memberStore.memberId))" @click="toCancelFollow(item.memberId,item.nickName)" type="warning" plain round style="width: 60px;margin-left: 80px" ><el-icon><Check/></el-icon>已关注</el-button>
      </div>

      <!-- 文字内容 -->
      <div class="message-content" style="color: rgb(51, 51, 51)">
        {{ item.textContent }}
      </div>

      <!-- 图片内容 -->
      <!-- 图片/视频缩略图容器 -->
      <div class="img-content" v-if="item.images && item.images.length">
        <div
            class="media-thumb"
            v-for="(img, index) in item.images"
            :key="index"
            @click="handleMediaClick(img)"
        >
          <template v-if="img.isVideo === 0">
            <!-- 普通图片，点击预览 -->
            <el-image
                :src="img.preUrl"
                class="post-image"
                fit="cover"
                :preview-src-list="[img.oriUrl]"
                :initial-index="index"
                preview-teleported
                style="transition: transform 0.3s ease;"
            />
          </template>
          <template v-else>
            <!-- 视频缩略图：点击后弹窗播放 -->
            <img :src="img.preUrl" class="post-image video-thumb" style="transition: transform 0.3s ease;"/>
            <span class="video-icon">▶</span>
          </template>
        </div>
      </div>

      <!-- 视频播放弹窗 -->
      <el-dialog
          v-model="videoDialogVisible"
          width="60%"
          top="10vh"
          :before-close="handleDialogClose"
          class="video-dialog"
          :modal="false"
          style="box-shadow: none;background-color: black"
      >
        <video
            v-if="currentVideoUrl"
            :src="currentVideoUrl"
            controls
            autoplay
            muted
            style="width: 100%; max-height: 70vh; background: #000"
        ></video>
      </el-dialog>
      <div @click="toBlogDetailPage(item.id)" class="clickable-text" style="display: flex;justify-content: center;align-items: center;width: 640px;height: 24px;margin-top: 5px">
        查看详情<el-icon><ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 加载触发器，占位符，用于触发懒加载 -->
    <div ref="loadMoreRef" v-if="blogSearchStore.hasMore" style="height: 10px;background-color: white"></div>
    <!-- 加载中提示 -->
    <div v-loading="blogSearchStore.loading" element-loading-text="加载中..." v-if="blogSearchStore.hasMore" style="height: 100px;width: 100%;background-color: white"></div>
    <div v-if="!blogSearchStore.hasMore" style="display:flex;align-items: center;justify-content: center;height: 60px;background-color: white">没有更多了~</div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {followedMembersStore} from "../../../pinia/follow/FollowedMemberIdsShare.js";
import {memberInfoShare} from "../../../pinia/member/MemberInfoShare";
import {ArrowRight, ChatRound, Check, Operation, Plus, Star} from "@element-plus/icons-vue";
import {useBlogSearchStore} from "../../../pinia/search/useBlogSearchStore.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {publisherMemberIdShare} from "../../../pinia/detail/PublisherMemberIdShare.js";
import mRequest from "../../../utils/MemberRequest.js";
import {useBlogDetailStore} from "../../../pinia/detail/UseBlogDetailStore.js";
import memberRequest from "../../../utils/MemberRequest.js";
import {useRouter} from "vue-router";

const router = useRouter()
const blogDetailStore = useBlogDetailStore()
const publisherIdStore = publisherMemberIdShare()
const blogSearchStore = useBlogSearchStore()
const followedStore = followedMembersStore()
const memberStore = memberInfoShare()
const allFollowedSet = computed(() => new Set(followedStore.allFollowedIds))

const videoDialogVisible = ref(false)
const currentVideoUrl = ref('')

function handleMediaClick(img) {
  if (img.isVideo === 1) {
    currentVideoUrl.value = img.oriUrl
    videoDialogVisible.value = true
  }
  // 图片自动 preview，不需要手动处理
}

function handleDialogClose() {
  videoDialogVisible.value = false
  currentVideoUrl.value = ''
}

const loadMoreRef = ref(null)
let observer = null;
onMounted(() => {
  // 创建 IntersectionObserver（监听元素进入视口）
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      blogSearchStore.getBLogsBySearch();
    }
  })

  // 开始监听那个 div（只要它出现在屏幕里就触发加载）
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
})
onBeforeUnmount(() => {
  blogSearchStore.reset()
})

const toFollow = async (memberId) => {
  if (memberStore.memberId === '') {
    ElMessage({
      type: "warning",
      message: "用户未登录"
    })
    router.push("/phoneLogin")
    return;
  }
  try {
    const response = await mRequest.get("/follow/toFollow",{
      params: {
        followedId: memberId,
        followerId: memberStore.memberId
      }
    })
    if (response.data.code === 200) {
      followedStore.allFollowedIds.push(Number(memberId))
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
const toCancelFollow =  async (memberId,nickName) => {
  ElMessageBox.confirm(
      `确认取消关注${nickName}吗？`,
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
          followedId: memberId,
          followerId: memberStore.memberId
        }
      })
      if (response.data.code === 200) {
        followedStore.allFollowedIds = followedStore.allFollowedIds.filter(id => id !== Number(memberId))
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
const toPublisherDetail = (item) => {
  publisherIdStore.publisherId = item.memberId
  publisherIdStore.avatarUrl = item.avatar
  publisherIdStore.publisherNickName = item.nickName
  publisherIdStore.isFollowed = allFollowedSet.value.has(Number(item.memberId))
  router.push("/mobileDashboard/publisherInfo/memberLeaveMessage")
}
const toBlogDetailPage = async (blogId) => {
  try {
    const response = await mRequest.get("/blog/getBlogById",{
      params: {
        blogId: blogId
      }
    })
    if (response.data.code === 200) {
      blogDetailStore.blogDetail = response.data.data
      router.push("/mobileDashboard/homeBlogDetail")
    } else {
      ElMessage({
        type: 'warning',
        message: response.data.msg
      })
    }
  } catch (e) {
    console.log(e.message)
  }
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

.img-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 640px;
}

.media-thumb {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

/* 视频上的播放图标 */
.video-thumb {
  filter: brightness(0.7);
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

/* 弹窗样式可定制 */
.video-dialog .el-dialog__body {
  padding: 0;
}
.post-image:hover {
  transform: scale(1.05); /* 放大1.05倍，可以根据需要调整 */
}
</style>