<template>
  <div>
<!--    顶部-->
    <div style="height: 40px; display: flex; flex-direction: row;background-color: white">
      <div style="font-size: 20px;padding-left: 10px;padding-top: 5px" @click="comeBack()">
        <div class="clickable-text" style="display: flex; align-items: center; font-size: 20px;"><el-icon><arrow-left-bold /></el-icon>返回</div>
      </div>
      <div style="display: flex;align-items: center;font-size: 20px;margin: 0 auto;padding-right: 80px;">
        {{blogDetailStore.blogDetail.nickName}}
      </div>
    </div>
<!--    博客详情栏目-->
    <div style="margin-top: 3px;background-color: white">
<!--      状态栏-->
      <div style="height: 30px;display: flex;flex-direction: row;justify-content: space-between">
        <div style="padding-left: 15px;display: flex;align-items: center" v-if="blogDetailStore.blogDetail.isPublic === 1">公开</div>
        <div style="padding-left: 15px;display: flex;align-items: center" v-if="blogDetailStore.blogDetail.isPublic === 0">私密</div>
        <div style="padding-right: 15px;display: flex;align-items: center"><el-icon><arrow-down /></el-icon></div>
      </div>
<!--      内容详情栏目-->
      <div style="margin-top: 15px">
<!--        用户信息栏-->
        <div style="display: flex;flex-direction: row;height: 60px">
<!--          头像-->
          <div style="padding-left: 15px;">
            <el-avatar :src="blogDetailStore.blogDetail.avatar" size="large"></el-avatar>
          </div>
<!--          信息-->
          <div style="display: flex;flex-direction: row;justify-content: space-between;">
            <div style="height: 60px;padding-left: 10px;width: 416px">
              <div style="height: 20px;font-size: 15px;padding-top: 6px;font-weight: 500">{{blogDetailStore.blogDetail.nickName}}</div>
              <div style="height: 20px;font-size: 14px;margin-top: 5px;color: gray">{{blogDetailStore.blogDetail.createTime}}</div>
            </div>
            <div style="height: 60px;display: flex;align-items: center;padding-right: 30px">
              <el-button @click="toFollow(blogDetailStore.blogDetail.memberId)" type="success" plain round style="width: 60px;margin-left: 80px" v-if="!(allFollowedSet.has(blogDetailStore.blogDetail.memberId)) && (Number(blogDetailStore.blogDetail.memberId) !== Number(memberStore.memberId))" ><el-icon><plus/></el-icon>关注</el-button>
              <el-button @click="toCancelFollow(blogDetailStore.blogDetail.memberId,blogDetailStore.blogDetail.nickName)" type="warning" plain round style="width: 60px;margin-left: 80px" v-if="(allFollowedSet.has(blogDetailStore.blogDetail.memberId)) && (Number(blogDetailStore.blogDetail.memberId) !== Number(memberStore.memberId))"><el-icon><plus/></el-icon>已关注</el-button>
              <div style="width: 140px" v-if="Number(blogDetailStore.blogDetail.memberId) === Number(memberStore.memberId)">
                <span style="margin-left: 10px"><el-button type="primary" plain round style="width: 60px"><el-icon><edit /></el-icon>编辑</el-button></span>
                <span style="margin-left: 10px"><el-button type="danger" plain round style="width: 60px"><el-icon><delete /></el-icon>删除</el-button></span>
              </div>
            </div>
          </div>
        </div>
<!--        文本信息栏-->
        <div style="margin: auto 70px;padding-left: 10px;font-size: 14px" v-if="blogDetailStore.blogDetail.textContent">
          {{blogDetailStore.blogDetail.textContent}}
        </div>
<!--        媒体信息栏-->
        <div style="margin: 10px 70px;padding-left: 10px;" class="img-content" v-if="blogDetailStore.blogDetail.images && blogDetailStore.blogDetail.images.length">
          <el-image
              v-for="(img, index) in blogDetailStore.blogDetail.images"
              :key="index"
              :src="img"
              class="post-image"
              fit="cover"
              :preview-src-list="blogDetailStore.blogDetail.images"
              :initial-index="index"
              preview-teleported
          />
        </div>
<!--        功能栏-->
        <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;padding: 0 70px;margin-top: 10px">
          <div class="clickable-text" style="width: 80px;display: flex;align-items: center;justify-content: center">
            <el-icon><Star/></el-icon>点赞 {{blogDetailStore.blogDetail.likeNum}}
          </div>
          <div class="clickable-text" style="width: 80px;display: flex;align-items: center;justify-content: center">
            <el-icon><chat-round/></el-icon>评论 {{blogDetailStore.blogDetail.commentNum}}
          </div>
          <div class="clickable-text" style="display: flex;align-items: center;justify-content: center">
            <el-dropdown placement="top">
              <div style="display: flex;justify-content: center;align-items: center" class="clickable-text"><el-icon><operation/></el-icon>更多</div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="Number(memberStore.memberId) !== Number(blogDetailStore.blogDetail.memberId)" @click="toReport(blogDetailStore.blogDetail.id)" >举报</el-dropdown-item>
                  <el-dropdown-item >分享</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
          <div v-for="item in blogDetailStore.comments" :key="item.id" style="margin-bottom: 10px">
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
          <div ref="loadMoreRef" v-if="blogDetailStore.hasMore" style="height: 10px;background-color: white"></div>
          <!-- 加载中提示 -->
          <div v-loading="blogDetailStore.commentsLoading" element-loading-text="加载中..." v-if="blogDetailStore.hasMore" style="height: 100px;width: 100%;background-color: white"></div>
          <div v-if="!blogDetailStore.hasMore" style="display:flex;align-items: center;justify-content: center;height: 60px;background-color: white">我也是有底线的~</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref, toRef} from "vue";
import {
  ArrowDown,
  ArrowLeftBold,
  Camera,
  ChatRound, Delete,
  Edit,
  Operation,
  Plus,
  Star,
} from "@element-plus/icons-vue";
import mRequest from "../../../utils/MemberRequest.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";
import {memberInfoShare} from "../../../pinia/member/MemberInfoShare.js";
import {followedMembersStore} from "../../../pinia/follow/FollowedMemberIdsShare.js";
import {useBlogDetailStore} from "../../../pinia/detail/UseBlogDetailStore.js";

const loadMoreRef = ref(null)
let observer = null;
onMounted(() => {
  blogId.value = localStorage.getItem('blogId')

  // 创建 IntersectionObserver（监听元素进入视口）
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      blogDetailStore.getComments()
    }
  })

  // 开始监听那个 div（只要它出现在屏幕里就触发加载）
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
})

onBeforeUnmount(() => {
  blogDetailStore.reset()
})

const blogDetailStore = useBlogDetailStore()
const router = useRouter()
const followStore = followedMembersStore()
const memberStore = memberInfoShare()

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

const comment = ref([
  {
    id: '',
    memberId: '',
    commentNickName: '',
    avatar: '',
    textContent: '',
    likeNum: '',
    isPublic: '',
    createTime: '',
  }
])

const toFollow = async (memberId) => {
  try {
    const response = await mRequest.get("/follow/toFollow",{
      params: {
        followedId: memberId,
        followerId: memberStore.memberId
      }
    })
    if (response.data.code === 200) {
      followStore.allFollowedIds.push(memberId)
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
    ElMessage({
      type: "error",
      message: "未知错误"
    })
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
          followerId: memberStore.memberId
        }
      })
      if (response.data.code === 200) {
        followStore.allFollowedIds = followStore.allFollowedIds.filter(id => id !== memberId)
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
const allFollowedSet = computed(() => new Set(followStore.allFollowedIds))
const commentValue = ref('');
const commentForm = reactive({
  memberId: '',
  blogId: '',
  textContent: '',
})
const refresh = async () => {
  try {
    const response = await mRequest.get("/comment/listByBlogId",{
      params: {
        id: blogDetailStore.blogDetail.id,
        currentPage: 1,
        pageSize: 20
      }
    })
    if (response.data.code === 200) {

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
const id = ref(-1)
const publishComment = async () => {
  if (commentValue.value.length === 0) {
    ElMessage({
      type: 'error',
      message: '评论内容不能为空'
    })
  }else {
    commentForm.memberId = memberStore.memberId
    commentForm.blogId = blogDetailStore.blogDetail.id;
    commentForm.textContent = commentValue.value;
    try {
      const response = await mRequest.post("/comment/save",commentForm)
      if (response.data.code === 200) {
        ElMessage({
          type: 'success',
          message: '评论成功'
        })
        //清空输入框
        id.value -= 1;
        const comment = [{
            id: id.value,
            memberId: memberStore.memberId,
            commentNickName: memberStore.memberNickName,
            avatar: memberStore.avatarUrl,
            textContent: commentValue.value,
            likeNum: 0,
            isPublic: 1,
            createTime: '刚刚',
        }]
        commentValue.value = ''
        blogDetailStore.comments = comment.concat(blogDetailStore.comments)
        blogDetailStore.blogDetail.commentNum += 1;
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

const comeBack = () => {
  router.back();
}

const isClicked = ref(true)

const blogLoading = ref(true)
const commentsLoading = ref(true)
//保存登录用户的头像路径
const blogId = ref('')
</script>

<style scoped>
.clickable-text {
  cursor: pointer;
  color: rgb(32, 28, 29);
  transition: color 0.3s;
  font-size: 14px;
  color: rgba(151, 151, 151);
  font-weight: 500;
}
.clickable-text:hover {
  color: skyblue;
}
.clickable-text-selected {
  color: skyblue;
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

</style>