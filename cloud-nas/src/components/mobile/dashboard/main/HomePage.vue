<template>
  <div style="background-color: rgba(220, 223, 230, 0.64);">
    <div v-if="blogList"
         class="post-card"
         v-for="item in blogList"
         :key="item.id"
         >
      <!-- 用户信息 -->
      <div class="user-info">
        <el-avatar :src="item.avatar"/>
        <div style="margin-left: 5px;width: 420px">
          <div @click="toPublisherDetail(item)" style="font-size: 15px;font-weight: 500;" class="nickName-text">{{ item.nickName }}</div>
          <div style="font-size: 12px;color: rgb(147,147,147)">{{ item.createTime }}</div>
        </div>
        <el-button v-if="!(allFollowedSet.has(item.memberId)) && !(Number(item.memberId) === Number(storeMemberId))" @click="toFollow(item.memberId)" type="success" plain round style="width: 60px;margin-left: 80px" ><el-icon><plus/></el-icon>关注</el-button>
        <el-button v-if="(allFollowedSet.has(item.memberId)) && !(Number(item.memberId) === Number(storeMemberId))" @click="toCancelFollow(item.memberId,item.nickName)" type="warning" plain round style="width: 60px;margin-left: 80px" ><el-icon><check/></el-icon>已关注</el-button>
        <div style="width: 140px" v-if="Number(item.memberId) === Number(storeMemberId)">
          <span style="margin-left: 10px"><el-button @click="toEditBlog(item)" type="primary" plain round style="width: 60px"><el-icon><edit /></el-icon>编辑</el-button></span>
          <span @click="toDeleteBlog(item.id)" style="margin-left: 10px"><el-button type="danger" plain round style="width: 60px"><el-icon><delete /></el-icon>删除</el-button></span>
        </div>
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

      <!-- 点赞评论等 -->
      <div class="action-bar" style="align-items: center">
        <div @click="toLike(item)" class="clickable-text" :class="{'clickable-text-selected':item.isLike}" style="width: 80px;display: flex;justify-content: center;align-items: center">
          <el-icon><Star /></el-icon>点赞 {{item.likeNum}}
        </div>
        <div class="clickable-text" style="width: 80px;display: flex;justify-content: center;align-items: center" @click="item.isShowComment = !item.isShowComment" :class="{'clickable-text-selected':item.isShowComment}">
          <el-icon><chat-round/></el-icon>评论 {{item.commentNum}}
        </div>
        <div >
          <el-dropdown placement="top">
            <div style="display: flex;justify-content: center;align-items: center" class="clickable-text"><el-icon><operation/></el-icon>更多</div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="Number(memberStore.memberId) !== Number(item.memberId)" @click="toReport(item.id)" >举报</el-dropdown-item>
                <el-dropdown-item >分享</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!--      评论展开-->
        <div style="background-color:rgb(255,255,255);height: auto; position: relative;padding-top: 20px" v-if="item.isShowComment">
          <!--        发表评论块-->
          <div style=" display: flex;flex-direction: row">
            <div >
              <el-avatar  :src="memberStore.avatarUrl" style="font-size: 20px;width: 30px;height: 30px"/>
            </div>
            <div style="margin-left: 8px">
              <el-input @keyup.enter="publishComment(item)" v-model="item.commentValue" style="width: 590px;height: 35px;border: skyblue" placeholder="输入你的评论"></el-input>
            </div>
          </div>
          <div style="margin-top: 10px;margin-left: 36px;display: flex;width: 590px;justify-content: space-between">
            <div>
              <div></div>
              <div><el-button style="border: 0px;width: 30px"><el-icon size="20px" style="color:rgb(131, 131, 131);"><camera/></el-icon></el-button></div>
            </div>
            <div>
              <el-button @click="publishComment(item)" type="primary" round>评论</el-button>
            </div>
          </div>
          <!--        评论内容-->
            <div style="margin-top: 10px;">
              <span style="margin-right: 20px" @click="isClicked = isClicked ? isClicked : !isClicked" :class="{'clickable-text-selected':isClicked}" class="clickable-text">按热度</span><span @click="isClicked = !isClicked ? isClicked : !isClicked" :class="{'clickable-text-selected':!isClicked}" class="clickable-text">按时间</span>
            </div>
            <div style="height: 50px;width: 626px;text-align: center;margin-top: 20px;" v-if="item.comments.length === 0">
              评论区空空如也，去发表你的评论吧~
            </div>
            <div v-if="item.comments.length > 0" v-for="comment in item.comments" :key="comment.id">
              <div>
                <div style="margin-top: 10px;display:flex;flex-direction: row">
                  <el-avatar @click="toComPublisherDetail(comment)" v-if="comment.avatar" :src="comment.avatar" style="font-size: 20px;width: 30px;height: 30px"  class="avatar"/>
                  <div style="margin-left: 5px;width: 420px">
                    <div style="font-size: 13px;font-weight: 500;color: rgb(64, 158, 255)" class="clickable-text" @click="reply(comment,item)">{{ comment.commentNickName }}</div>
                    <div style="font-size: 12px;color: rgb(147,147,147)">{{ comment.createTime }}</div>
                  </div>
                </div>
                <div style="font-size: 13px;margin-left: 35px;margin-top: 5px">
                  {{comment.textContent}}
                </div>
              </div>
            </div>
            <div @click="toBlogDetailPage(item)" class="clickable-text" style="text-align: center;width: 626px;height: 24px;margin-bottom: 5px;margin-top: 15px" v-if="item.comments.length > 0">
              查看详情及全部评论<el-icon><arrow-right /></el-icon>
            </div>
        </div>
    </div>

    <!-- 加载触发器，占位符，用于触发懒加载 -->
    <div ref="loadMoreRef" v-if="blogStore.hasMore" style="height: 10px;background-color: white"></div>
    <!-- 加载中提示 -->
    <div v-loading="blogStore.loading" element-loading-text="加载中..." v-if="blogStore.hasMore" style="height: 100px;width: 100%;background-color: white"></div>

    <div v-if="!blogStore.hasMore" style="display:flex;align-items: center;justify-content: center;height: 60px;background-color: white">没有更多了~</div>
  </div>
</template>


<script setup>
import {
  ArrowRight,
  Camera,
  ChatRound,
  Check,
  Delete,
  Edit,
  Operation,
  Plus,
  Pointer, Star,
} from "@element-plus/icons-vue";
import {computed, onMounted, onUnmounted, reactive, ref, onBeforeUnmount, watch, nextTick} from "vue";
import mRequest from "../../../../utils/MemberRequest.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter,useRoute} from "vue-router";
import {homeBlogStore} from "../../../../pinia/honeBlog/HomeBlogShared.js";
import {followedMembersStore} from "../../../../pinia/follow/FollowedMemberIdsShare.js";
import {storeToRefs} from "pinia";
import {memberInfoShare} from "../../../../pinia/member/MemberInfoShare.js";
import {publisherMemberIdShare} from "../../../../pinia/detail/PublisherMemberIdShare.js";
import {memberEditBlogShare} from "../../../../pinia/member/MemberEditBlogShare.js";
import {useHomeScrollStore} from "../../../../pinia/scroll/UseHomeScrollStore.js";
import 'element-plus/es/components/collapse-transition/style/css'

const loadMoreRef = ref(null)
let observer = null;
const scrollContainer = ref(null)
const homeScrollStore = useHomeScrollStore()
const route = useRoute()
const itemRefs = ref([]);
const visibleSet = reactive(new Set());
onMounted(() => {
  storeMemberId.value = memberStore.memberId
  if (memberStore.memberId !== '') {
    followedStore.fetchAllFollowedIds();
  }

  // 创建 IntersectionObserver（监听元素进入视口）
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      if (blogStore.sortField === 'default') {
        blogStore.fetchBlogs()
      } else {
        blogStore.fetchBlogsBySort()
      }
    }
  })

  // 开始监听那个 div（只要它出现在屏幕里就触发加载）
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
  // restoreScrollPosition()

})
const isToBlogDetail = ref(false)
onBeforeUnmount(() => {
  // 页面销毁前停止监听
  if (loadMoreRef.value && observer) {
    observer.unobserve(loadMoreRef.value)
  }
  if (!blogStore.isTOBlogDetail) {
    blogStore.reset()
  }
})
// // 保存滚动位置
// const handleScroll = debounce(() => {
//   homeScrollStore.savePosition(route.name, scrollContainer.value.scrollTop);
// },200);
//
// // 恢复滚动位置
// const restoreScrollPosition = () => {
//   const position = homeScrollStore.getPosition(route.name);
//   if (position) {
//     scrollContainer.value.scrollTop = position;
//   }
// };
//
// // 监听路由变化
// watch(() => route.name, (to, from) => {
//   // 保存旧路由的滚动位置
//   if (from && scrollContainer.value) {
//     homeScrollStore.savePosition(from, scrollContainer.value.scrollTop);
//   }
//
//   // 进入新页面时恢复滚动位置
//   if (to) {
//     // 使用nextTick确保DOM已更新
//     nextTick(() => {
//       const position = homeScrollStore.getPosition(to);
//       if (position) {
//         scrollContainer.value.scrollTop = position;
//       }
//     });
//   }
// });

const memberStore = memberInfoShare()
const router = useRouter();
const blogStore = homeBlogStore()
const followedStore = followedMembersStore()
const publisherIdStore = publisherMemberIdShare()
const { blogList, loading} = storeToRefs(blogStore) // 响应式解构
const storeMemberId = ref()
const allFollowedSet = computed(() => new Set(followedStore.allFollowedIds))
const memberEditStore = memberEditBlogShare()

const toLike = async (item) => {
  if (memberStore.memberId === '') {
    ElMessage({
      type: 'warning',
      message: "用户未登录"
    })
    router.push("/phoneLogin");
    return;
  }
  try {
    const response = await mRequest.get("/blog/storeLike",{
      params: {
        blogId: item.id,
        memberId: memberStore.memberId
      }
    })
    if (response.data.code === 200) {
      ElMessage({
        type: "success",
        message: response.data.data
      })
      item.isLike = !item.isLike;
      if (item.isLike) {
        item.likeNum ++;
      } else {
        item.likeNum --;
      }
    } else {
      ElMessage({
        type: "warning",
        message: response.data.msg
      })
    }
  } catch (e) {
    console.log(e.message)
  }
}

const toEditBlog = (item) => {
  memberEditStore.memberEditBlog.id = item.id
  memberEditStore.memberEditBlog.textContent = item.textContent
  memberEditStore.memberEditBlog.images = item.images
  memberEditStore.memberEditBlog.isPublic = item.isPublic
  memberEditStore.memberEditBlog.createTime = item.createTime
  console.log(memberEditStore.memberEditBlog)
  router.push("/mobileDashboard/edit")
}

const toReport = async (blogId) => {
  try {
    const response = await mRequest.get("/report/reportById",{
      params: {
        blogId: blogId,
        memberId: memberStore.memberId
      }
    })
    if (response.data.code === 200) {
      ElMessage({
        type: "success",
        message: "举报成功"
      })
    }else {
      ElMessage({
        type: "warning",
        message: response.data.msg
      })
    }
  } catch (e) {
    console.log(e.message)
  }
}

const toDeleteBlog = (blogId) => {
  ElMessageBox.confirm(
      `确认删除吗？`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then( async () => {
    // 用户点击了“确定”
    try {
      const response = await mRequest.get("/blog/removeById",{
        params: {
          blogId: blogId,
        }
      })
      if (response.data.code === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功，博客以已移入回收站'
        })
      } else {
        ElMessage({
          type: "warning",
          message: "删除失败"
        })
      }
    } catch (e) {
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
  publisherIdStore.isFollowed = allFollowedSet.value.has(item.memberId)
  router.push("/mobileDashboard/publisherInfo/memberLeaveMessage")
}
const toComPublisherDetail = (item) => {
  publisherIdStore.publisherId = item.memberId
  publisherIdStore.avatarUrl = item.avatar
  publisherIdStore.publisherNickName = item.commentNickName
  publisherIdStore.isFollowed = allFollowedSet.value.has(item.memberId)
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
        followerId: storeMemberId.value
      }
    })
    if (response.data.code === 200) {
      followedStore.allFollowedIds.push(memberId)
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
const toCancelFollow = async (memberId,nickName) => {
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
          followerId: storeMemberId.value
        }
      })
      if (response.data.code === 200) {
        followedStore.allFollowedIds = followedStore.allFollowedIds.filter(id => id !== memberId)
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

const reply = (comment,item) => {
  item.commentValue = '@' + comment.commentNickName + ' ';
}

const commentForm = reactive({
  memberId: '',
  blogId: '',
  textContent: '',
})
const refresh = async (item) => {
  try {
    const response = await mRequest.get("/comment/listByBlogId",{
      params: {
        id: item.id,
      }
    })
    if (response.data.code === 200) {
      item.comments = response.data.data
      console.log(response.data.data)
      console.log(item.comments)
    } else {
      ElMessage({
        type: "warning",
        message: "拉取评论列表失败"
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
const publishComment = async (item) => {
  if (memberStore.memberId === '') {
    ElMessage({
      type: 'warning',
      message: '用户未登录'
    })
    router.push("/phoneLogin")
    return;
  }
  if (item.commentValue.length === 0) {
    ElMessage({
      type: 'error',
      message: '评论内容不能为空'
    })
  }else {
    commentForm.memberId = memberStore.memberId
    commentForm.blogId = item.id;
    commentForm.textContent = item.commentValue;
    try {
      const response = await mRequest.post("/comment/save",commentForm)
      if (response.data.code === 200) {
        ElMessage({
          type: 'success',
          message: '评论成功'
        })
        //刷新评论区数据
        refresh(item);
        item.commentNum += 1;
        //清空输入框
        item.commentValue = ''
      } else {
        ElMessage({
          type: "error",
          message: response.data.msg
        })
      }
    } catch (e) {
      console.log(e.message)
    }
  }
}

const isClicked = ref(true)
const orderType = ref('default')
const getMemberBlogs = async () => {
  try {
    const response = await mRequest.get("/blog/list",{
      params: {
        orderType: orderType.value
      }
    })
    console.log(response.data)
    if (response.data.code === 200) {
      posts.value = response.data.data
      loading.value = false
    } else {
      ElMessage({
        type: 'warning',
        message: response.data.msg
      })
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: error.message
    })
  }
}

import {useBlogDetailStore} from "../../../../pinia/detail/UseBlogDetailStore.js";
import {debounce} from "lodash";
const blogDetailStore = useBlogDetailStore()
const toBlogDetailPage = (item) => {
  blogStore.isTOBlogDetail = true;
  blogDetailStore.blogDetail = item
  router.push("/mobileDashboard/homeBlogDetail")
}

</script>

<style scoped>
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
.el-dropdown,
.el-dropdown-menu {
  border: none !important;
  box-shadow: none !important;
}

.avatar {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
.avatar:hover {
  box-shadow: 0 0 0 3px rgba(135, 206, 250, 0.5);
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
.nickName-text-selected {
  color: skyblue;
}

.post-card {
  background: white;
  padding: 10px 20px;
  margin-bottom: 5px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.user-info .username {
  font-weight: bold;
  margin-left: 10px;
}
.user-info .time {
  color: #888;
  font-size: 12px;
  margin-left: auto;
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

</style>