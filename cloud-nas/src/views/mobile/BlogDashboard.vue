<template>
<!--  总块-->
  <div class="main-box">
<!--    头部导航栏  -->
    <div class="nav-header">
<!--      左边logo区-->
      <div class="header-left">

      </div>
<!--      中间导航栏区-->
      <div class="header-nav">
<!--      搜索框-->
        <div style="width: 200px;padding: 10px 0px">
          <el-input :suffix-icon="Search" v-model="blogSearchStore.searchValue" @keyup.enter="toFind()" style="width: 200px;height: 40px" placeholder="搜索" />
        </div>
<!--       导航-->
        <div class="nav-main">
          <el-tooltip content="首页" effect="light"><div class="main-nav nav-home box" :class="{'text-selected':boxSelect === 1}"  @click="toHomePage()" ><el-icon style="font-size: 25px"><home-filled /></el-icon></div></el-tooltip>
          <el-tooltip content="关注" effect="light"><div class="main-nav nav-follow box" :class="{'text-selected':boxSelect === 2}" @click="toFollowedMembersPage()" ><el-icon style="font-size: 25px"><star/></el-icon></div></el-tooltip>
          <el-tooltip content="我的" effect="light"><div class="main-nav nav-own box" :class="{'text-selected':boxSelect === 3}" @click="toMemberBlog()" ><el-icon style="font-size: 25px"><user-filled /></el-icon></div></el-tooltip>
          <el-tooltip content="信息" effect="light">
            <div  style="width: 136px;display: flex;justify-content: center;padding-top: 18px" class="msgbox" :class="{'text-selected':boxSelect === 4}" @click="toMemberMessagePage()">
              <el-badge :value="messageOPStore.newsNums" class="mark" :max="99" :show-zero="false">
                <el-icon style="font-size: 25px">
                  <message />
                </el-icon>
              </el-badge>
            </div>
          </el-tooltip>
          <div class="main-nav">
            <el-dropdown v-if="memberStore.memberId !== ''" placement="bottom">
              <el-avatar v-if="memberStore.memberId !== '' " :src="memberStore.avatarUrl" class="avatar" :class="{'avatar-selected':boxSelect === 0}"/>
              <template  #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="toMemberDetail">个人信息</el-dropdown-item>
                  <el-dropdown-item @click="toRecover()" style="justify-content: center;">回收站</el-dropdown-item>
                  <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-avatar @click="toLogin()" v-if="memberStore.memberId === ''" class="avatar" :icon="UserFilled" />
          </div>
        </div>
      </div>
<!--      右边其它-->
      <div class="header-right">

      </div>
    </div>
<!--    身子内容区-->
    <div class="main-body" ref="scrollContainer">
<!--      中间内容盒子-->
      <div class="main-box-container" >
<!--        左边导航栏-->
        <div class="main-left">
          <router-view name="left"></router-view>
        </div>
<!--         中间博客内容栏-->
        <div class="main-content" >
          <router-view name="main"></router-view>
        </div>
<!--        右边内容栏-->
        <div class="right-content">
          <router-view name="right"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {HomeFilled, Message, Star, UserFilled,Search} from "@element-plus/icons-vue";
import {useRouter,useRoute} from "vue-router";
import {onBeforeUnmount, onMounted, ref,watch,nextTick} from "vue";
import {ElMessage} from "element-plus";
import {followedMembersStore} from "../../pinia/follow/FollowedMemberIdsShare.js";
import {homeBlogStore} from "../../pinia/honeBlog/HomeBlogShared.js";
import {publisherMemberIdShare} from "../../pinia/detail/PublisherMemberIdShare.js";
import {memberInfoShare} from "../../pinia/member/MemberInfoShare.js";
import {useScrollStore} from "../../pinia/honeBlog/ScrollShare.js";
import { debounce } from 'lodash';
import {useChatStore} from "../../pinia/chat/chatStore.js";
import {memberBlogShare} from "../../pinia/member/MemberBlogShare.js";
import {useBlogDetailStore} from "../../pinia/detail/UseBlogDetailStore.js";
import {useMessageOPStore} from "../../pinia/chat/UseMessageOPStore.js";
import {useBlogSearchStore} from "../../pinia/search/useBlogSearchStore.js";

const messageOPStore = useMessageOPStore()
const boxSelect = ref(1)
const followedStore = followedMembersStore()
const homeStore = homeBlogStore()
const publisherStore = publisherMemberIdShare()
const memberStore = memberInfoShare();
const chatStore = useChatStore()
const router = useRouter();
const scrollContainer = ref(null)
const route = useRoute()
const scrollStore = useScrollStore()
const memberBlogStore = memberBlogShare()
const blogSearchStore = useBlogSearchStore()

// 保存滚动位置
const handleScroll = debounce(() => {
  scrollStore.savePosition(route.name, scrollContainer.value.scrollTop);
},200);

// 恢复滚动位置
const restoreScrollPosition = () => {
  const position = scrollStore.getPosition(route.name);
  if (position) {
    scrollContainer.value.scrollTop = position;
  }
};

// 监听路由变化
watch(() => route.name, (to, from) => {
  // 保存旧路由的滚动位置
  if (from && scrollContainer.value) {
    scrollStore.savePosition(from, scrollContainer.value.scrollTop);
  }

  // 进入新页面时恢复滚动位置
  if (to) {
    // 使用nextTick确保DOM已更新
    nextTick(() => {
      const position = scrollStore.getPosition(to);
      if (position) {
        scrollContainer.value.scrollTop = position;
      }
    });
  }
});

onMounted (() => {
  // 初始加载时恢复滚动位置
  restoreScrollPosition();
  chatStore.connect();
  if (memberStore.memberId !== '') {
    messageOPStore.getPointMessages()
  }
})

const toFind = () => {
  if (blogSearchStore.searchValue === '') {
    ElMessage({
      type: 'warning',
      message: "搜索内容不能为空!!!"
    })
    return;
  }
  blogSearchStore.currentPage = 1;
  router.push("/mobileDashboard/homeSearch")
}

const toLogin = () =>  {
  router.push("/phoneLogin")
}

const toMemberDetail = () => {
  boxSelect.value = 0;
  publisherStore.publisherId = memberStore.memberId
  router.push("/mobileDashboard/MemberDetail/memberLeaveMessage")
}

const logout = () => {
  localStorage.clear();
  ElMessage({
    type: "success",
    message: "退出登录成功",
  })
  followedStore.reset();
  homeStore.reset();
  memberStore.reset();
  memberBlogStore.reset();
  chatStore.disconnect();

  router.push("/")
}
const toRecover = () => {
  boxSelect.value = 0;
  router.push("/mobileDashboard/recover")
}

const search = ref('')
const toHomePage = () => {
  boxSelect.value = 1;
  router.push("/mobileDashboard/home");
}
const toFollowedMembersPage = () => {
  boxSelect.value = 2;
  router.push("/mobileDashboard/followedMembers")
}
const toMemberBlog = () => {
  boxSelect.value = 3;
  router.push("/mobileDashboard/memberBlog");
}
const toMemberMessagePage = () => {
  boxSelect.value = 4;
  router.push("/mobileDashboard/memberMessage")
}

const avatarUrl = ref('')
</script>

<style scoped>
.msgbox:hover{
  background-color: rgb(208, 237, 250); /* 鼠标移上来时的颜色 */
}
.main-box {
  width: 100vw;
  height: 100vh;
}
.nav-header {
  position: fixed;
  background-color: white;
  height: 60px;
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.header-nav {
  width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: row;
  /*opacity: 0.8;*/
}
.nav-main {
  width: 680px;
  height: 100%;
  margin-left: 5px;
  margin-right: 5px;
  display: flex;
  flex-direction: row;
}
.main-nav {
  height: 100%;
  width: 136px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.nav-home {

}
.nav-follow {

}
.header-left {

}
.header-right {

}
.main-body {
  overflow: auto;
  scrollbar-width: none;
  margin-top: 65px;
  position: fixed;
  background-color: rgba(220, 223, 230, 0.64);
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 65px);
}
.main-box-container {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  width: 1200px;
  height: 100%;
}
.main-left {
  position: fixed;
  background-color: white;
  width: 200px;
  height: 100%;
}
.main-content {
  background-color: white;
  width: 680px;
  height: auto;
  margin-left: 205px;
  margin-right: 5px;
}
.right-content {
  position: fixed;
  margin-left: 890px;
  width: 310px;
  height: 100%;
  background-color: white;
}



.input-define {
  width: 200px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #fff;
}
.input-define:focus {
  border-color: #409EFF; /* Element 的主色 */
  box-shadow: 0 0 3px rgba(64, 158, 255, 0.5);
}

.box {
  transition: background-color 0.3s; /* 平滑过渡 */
  text-align: center;
  line-height: 100px;
  cursor: pointer;
}

.box:hover {
  background-color: rgb(208, 237, 250); /* 鼠标移上来时的颜色 */
}
.box-selected {
  background-color: skyblue;
}
.text-selected {
  color: skyblue;
}
.avatar {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
.avatar:hover {
  box-shadow: 0 0 0 3px rgba(135, 206, 250, 0.5);
}
.avatar-selected {
  box-shadow: 0 0 0 3px rgba(135, 206, 250, 0.5);
}
.item {
  margin-top: 10px;
}
</style>