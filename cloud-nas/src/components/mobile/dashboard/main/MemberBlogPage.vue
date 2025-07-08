<template>
  <div style="background-color: rgba(220, 223, 230, 0.64);">
    <div v-if="memberBlogStore.memberBlogList === null" style="background-color: white;text-align: center">
      当前没有发布的内容~
    </div>
    <div v-if="memberBlogStore.memberBlogList !== null" class="post-card" v-for="item in memberBlogStore.memberBlogList" :key="item.id" >
      <!-- 用户信息 -->
      <div class="user-info">
        <el-avatar :src="item.avatar"/>
        <div style="margin-left: 5px;width: 360px">
          <div style="font-size: 15px;font-weight: 500;" class="nickName-text">{{ item.nickName }}</div>
          <div style="font-size: 12px;color: rgb(147,147,147)">{{ item.createTime }}</div>
        </div>
        <div style="width: 60px;text-align: center;font-size: 15px">
          <div @click="changeBlogStatus(item)" class="secret-text" style="display: flex;align-items: center" v-if="item.isPublic === 0 || item.isPublic === 3">私密 <el-icon><Hide /></el-icon></div>
          <div @click="changeBlogStatus(item)" class="public-text" style="display: flex;align-items: center" v-if="item.isPublic === 1">公开 <el-icon><View /></el-icon></div>
          <div class="check-text" style="display: flex;align-items: center" v-if="item.isPublic === 2">审核中 <el-icon><UploadFilled /></el-icon></div>
        </div>
        <div style="width: 140px">
          <span @click="toEditBlog(item)" style="margin-left: 10px"><el-button type="primary" plain round style="width: 60px"><el-icon><edit /></el-icon>编辑</el-button></span>
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
        <div class="clickable-text" style="width: 80px;display: flex;justify-content: center;align-items: center">
          <el-icon><Star/></el-icon>点赞 {{item.likeNum}}
        </div>
        <div class="clickable-text" style="width: 80px;display: flex;justify-content: center;align-items: center" @click="item.isShowComment = !item.isShowComment" :class="{'clickable-text-selected':item.isShowComment}">
          <el-icon><chat-round/></el-icon>评论 {{item.commentNum}}
        </div>
        <div>
          <el-dropdown placement="top">
            <div style="display: flex;justify-content: center;align-items: center" class="clickable-text"><el-icon><operation/></el-icon>更多</div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item >分享</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

<!--      评论展开-->
      <div style="background-color:rgb(255,255,255);height: auto; margin-top: 20px;position: relative" v-if="item.isShowComment">
<!--        发表评论块-->
        <div style=" display: flex;flex-direction: row">
          <div >
            <el-avatar :src="memberStore.avatarUrl" style="font-size: 20px;width: 30px;height: 30px"/>
          </div>
          <div style="margin-left: 8px">
            <el-input v-model="item.commentValue" style="width: 590px;height: 35px;border: skyblue" placeholder="输入你的评论"></el-input>
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
              <el-avatar v-if="comment.avatar" :src="comment.avatar" style="font-size: 20px;width: 30px;height: 30px"  class="avatar"/>
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
    <div ref="loadMoreRef" v-if="memberBlogStore.hasMore" style="height: 10px;background-color: white"></div>
    <div v-loading="memberBlogStore.loading" element-loading-text="加载中..." v-if="memberBlogStore.hasMore" style="height: 100px;width: 100%;background-color: white"></div>
    <div v-if="!memberBlogStore.hasMore" style="display:flex;align-items: center;justify-content: center;height: 60px;background-color: white">没有更多了~</div>
  </div>
</template>


<script setup>
import {
  ArrowRight,
  Camera,
  ChatRound,
  Delete,
  Edit, Hide,
  Operation,
  Pointer, Star, UploadFilled, View,
} from "@element-plus/icons-vue";
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import mRequest from "../../../../utils/MemberRequest.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";
import {memberInfoShare} from "../../../../pinia/member/MemberInfoShare.js";
import {drectionStatusStore} from "../../../../pinia/honeBlog/DirectionStatusShare.js";
import {memberBlogShare} from "../../../../pinia/member/MemberBlogShare.js";
import {memberEditBlogShare} from "../../../../pinia/member/MemberEditBlogShare.js";
import {useBlogDetailStore} from "../../../../pinia/detail/UseBlogDetailStore.js";

const router = useRouter();
const memberStore = memberInfoShare()
const dereactionStore = drectionStatusStore()
const memberBlogStore = memberBlogShare()
const memberEditStore = memberEditBlogShare()


const loadMoreRef = ref(null)
let observer = null;
onMounted(() => {
  if (memberStore.memberId === '') {
    ElMessage({
      type: 'warning',
      message: "用户未登录"
    })
    router.push("/phoneLogin")
    return;
  }
  dereactionStore.memberBlogDerection = 1;
  // 创建 IntersectionObserver（监听元素进入视口）
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      memberBlogStore.fetchMemberBlogList();
    }
  })

  // 开始监听那个 div（只要它出现在屏幕里就触发加载）
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
})

onBeforeUnmount(() => {
  // 页面销毁前停止监听
  if (loadMoreRef.value && observer) {
    observer.unobserve(loadMoreRef.value)
  }
})

const changeBlogStatus = (item) => {
  ElMessageBox.confirm(
      `确认更换状态为${item.isPublic===1 ? '私密' : '公开'}吗？`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
    try {
      const status = ref(-1)
      if (item.isPublic === 1) {
        status.value = 0;
      } else if (item.isPublic === 0) {
        status.value = 1;
      } else if (item.isPublic === 3) {
        status.value = 2;
      }
      const response = await mRequest.get("blog/changeBlogStatus",{
        params: {
          blogId: item.id,
          isPublic: status.value
        }
      })
      if (response.data.code === 200) {
        if (status.value === 0 || status.value === 1) {
          ElMessage({
            type: "success",
            message: "修改成功"
          })
        } else {
          ElMessage({
            type: "success",
            message: "修改成功,将移交审核"
          })
        }
        item.isPublic = status.value
      } else {
        ElMessage({
          type: "error",
          message: "修改失败"
        })
        console.log(response.data.msg)
      }
    }catch (e) {
      console.log(e.message)
    }
  }).catch(() => {

  })
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
        memberBlogStore.fetchMemberBlogList();
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
      ElMessage({
        type: 'error',
        message: '未知错误'
      })
      console.log(e.message)
    }
  }
}

const isClicked = ref(true)

const blogDetailStore = useBlogDetailStore()
const toBlogDetailPage = (item) => {
  blogDetailStore.blogDetail = item
  router.push("/mobileDashboard/memberBlogDetail")
}

</script>

<style scoped>
.secret-text {
  cursor: pointer;
  color: orange;
}
.secret-text:hover {
  color: skyblue;
}
.public-text {
  cursor: pointer;
  color: skyblue;
}
.public-text:hover {
  color: orange;
}

.clickable-text {
  cursor: pointer;
  color: rgba(151, 151, 151);
  transition: color 0.3s;
  font-size: 14px;
  font-weight: 500;
}
.clickable-text:hover {
  color: skyblue;
}
.clickable-text-selected {
  color: skyblue;
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
.check-text {
  color: gray;
}
</style>