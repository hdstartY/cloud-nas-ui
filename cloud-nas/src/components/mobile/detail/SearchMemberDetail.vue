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
          <el-button v-if="!(allFollowedSet.has(Number(item.id))) && !(Number(item.id) === Number(memberStore.memberId))" @click="toFollow(item.id)" type="success" plain style="width: 60px;" ><el-icon><Plus/></el-icon>关注</el-button>
          <el-button v-if="(allFollowedSet.has(Number(item.id))) && !(Number(item.id) === Number(memberStore.memberId))" @click="toCancelFollow(item.id,item.nickName)" type="warning" plain style="width: 60px;" ><el-icon><Check/></el-icon>已关注</el-button>
          <el-button @click="toPublisherDetail(item)" type="info" plain><el-icon><MoreFilled /></el-icon></el-button>
        </div>
      </div>
    </div>
    <!-- 加载触发器，占位符，用于触发懒加载 -->
    <div ref="loadMoreRef" v-if="memberSearchStore.hasMore" style="height: 10px;background-color: white"></div>
    <!-- 加载中提示 -->
    <div v-loading="memberSearchStore.loading" element-loading-text="加载中..." v-if="memberSearchStore.hasMore" style="height: 100px;width: 100%;background-color: white"></div>
    <div v-if="!memberSearchStore.hasMore" style="display:flex;align-items: center;justify-content: center;height: 60px;background-color: white">没有更多了~</div>
  </div>
</template>

<script setup>


import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useMemberSearchStore} from "../../../pinia/search/useMemberSearchStore.js";
import {Check, MoreFilled, Plus} from "@element-plus/icons-vue";
import {followedMembersStore} from "../../../pinia/follow/FollowedMemberIdsShare.js";
import {memberInfoShare} from "../../../pinia/member/MemberInfoShare.js";
import {ElMessage, ElMessageBox} from "element-plus";
import mRequest from "../../../utils/MemberRequest.js";
import {publisherMemberIdShare} from "../../../pinia/detail/PublisherMemberIdShare.js";
import {useRouter} from "vue-router";

const router = useRouter()
const publisherIdStore = publisherMemberIdShare()
const memberStore = memberInfoShare()
const followedStore = followedMembersStore()
const memberSearchStore = useMemberSearchStore()
const allFollowedSet = computed(() => new Set(followedStore.allFollowedIds))

const loadMoreRef = ref(null)
let observer = null;
onMounted(() => {
  // 创建 IntersectionObserver（监听元素进入视口）
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      memberSearchStore.getMembersBySearch()
    }
  })

  // 开始监听那个 div（只要它出现在屏幕里就触发加载）
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
})
onBeforeUnmount(() => {
  memberSearchStore.reset()
})
const toPublisherDetail = (item) => {
  publisherIdStore.publisherId = item.id
  publisherIdStore.avatarUrl = item.avatar
  publisherIdStore.publisherNickName = item.nickName
  publisherIdStore.isFollowed = allFollowedSet.value.has(Number(item.id))
  router.push("/mobileDashboard/publisherInfo/memberLeaveMessage")
}
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

</script>

<style scoped>

</style>