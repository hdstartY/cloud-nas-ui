import { createRouter, createWebHistory } from 'vue-router'

// 引入页面
import Home from '../views/Home.vue'
import phoneLogin from '../components/home/LoginByPhone.vue'
import emailLogin from '../components/home/LoginByEmail.vue'
import register from '../components/home/Register.vue'

import Dashboard from "../views/Dashboard.vue";
import UserInfo from "../components/dashboard/UserInfoPage.vue";

import MobileHome from "../views/mobile/MobileHome.vue";
import MobilePhoneLogin from "../components/mobile/home/MobilePhoneLogin.vue";
import MobileEmailLogin from "../components/mobile/home/MobileEmailLogin.vue";
import MobileRegister from "../components/mobile/home/MobileRegister.vue";

import HomePage from "../components/mobile/dashboard/main/HomePage.vue";
import MemberBlog from "../components/mobile/dashboard/main/MemberBlogPage.vue";
import FollowedMembersPage from "../components/mobile/dashboard/main/FollowedMembersPage.vue";
import MemberMessagePage from "../components/mobile/dashboard/main/MemberMessagePage.vue";
import MemberLeftAsidePage from "../components/mobile/dashboard/leftaside/MemberLeftAsidePage.vue";
import MemberPublishBlogPage from "../components/mobile/dashboard/leftasidelinkpages/MemberPublishBlogPage.vue";
import HomeLeftAsidePage from "../components/mobile/dashboard/leftaside/HomeLeftAsidePage.vue";
import FollowedLeftAsidePage from "../components/mobile/dashboard/leftaside/FollowedLeftAsidePage.vue";

import BlogDetailPage from "../components/mobile/detail/BlogDetailPage.vue";
import BlogDashboard from "../views/mobile/BlogDashboard.vue";
import MemberInfoDetailPage from "../components/mobile/detail/MemberInfoDetailPage.vue";
import BlankPage from "../components/mobile/dashboard/leftaside/BlankPage.vue";

import LeaveMessageDetail from "../components/mobile/detail/LeaveMessageDetailPage.vue";
import MediaDetailPage from "../components/mobile/detail/MediaDetailPage.vue";
import PublisherInfoPage from "../components/mobile/detail/PublisherInfoPage.vue";

import MemberUpdateFile from "../components/mobile/dashboard/leftasidelinkpages/MemberUpdateFile.vue";
import MemberFilePage from "../components/mobile/dashboard/leftasidelinkpages/MemberFilePage.vue";
import MemberUpdateFIlePage from "../components/mobile/dashboard/leftasidelinkpages/MemberUpdateFIlePage.vue";

import RecoverPage from "../components/mobile/dashboard/main/RecoverPage.vue";
import BlogEditPage from "../components/mobile/detail/BlogEditPage.vue";
import ContentCheckPage from "../components/dashboard/ContentCheckPage.vue";
import ContentReportPage from "../components/dashboard/ContentReportPage.vue";
import PersonalMessageOP from "../components/mobile/detail/PersonalMessageOP.vue"
import HomeRightAside from "../components/mobile/dashboard/rightaside/HomeRightAside.vue"
import HomeSearch from "../components/mobile/dashboard/main/HomeSearch.vue"
import SearchBlogDetail from "../components/mobile/detail/SearchBlogDetail.vue"
import SearchMemberDetail from "../components/mobile/detail/SearchMemberDetail.vue"

const routes = [

  {
    path: '/',
    component: MobileHome,
    children: [
      {path: '',redirect: '/phoneLogin'},
      {path: 'phoneLogin', component: MobilePhoneLogin },
      {path: 'emailLogin', component: MobileEmailLogin },
      {path: 'register', component: MobileRegister },
    ]
  },
  {
    path: '/admin',
    component: Home,
    children: [
      {path: '',redirect: '/admin/phoneLogin'},
      { path: 'phoneLogin', component: phoneLogin },
      { path: 'emailLogin', component: emailLogin },
      { path: 'register', component: register }
    ]
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {path: '',redirect: '/dashboard/checkBlog'},
      {path: 'userInfo', component: UserInfo},
      {path: 'checkBlog', component: ContentCheckPage},
      {path: 'report', component: ContentReportPage},
    ]
  },
  {
    path: '/mobileDashboard',
    component: BlogDashboard,
    children: [
      {path: '',redirect: '/mobileDashboard/home'},
      {path: 'home', components: {
        left: HomeLeftAsidePage,
        main: HomePage,
        right: HomeRightAside,
        }},
      {path: 'memberBlog', components: {
        left: MemberLeftAsidePage,
        main: MemberBlog,
        }},
      {path: 'followedMembers', components: {
        left: FollowedLeftAsidePage,
        main: FollowedMembersPage,
        }},
      {path: 'memberMessage', components: {
        left: BlankPage,
        main: PersonalMessageOP,
        }},
      {path: 'messageDetail', components: {
          left: BlankPage,
          main: MemberMessagePage,
        }},
      {path: 'memberPublishBlog', components: {
          left: MemberLeftAsidePage,
          main: MemberPublishBlogPage,
      }},
      {path: 'memberBlogDetail',name: 'BlogDetail',components: {
          left: BlankPage,
          main: BlogDetailPage,

      },
          meta: { keepScrollPosition: true }
      },
      {path: 'homeBlogDetail', components: {
          left: BlankPage,
          main: BlogDetailPage,
      }},
      { path: 'MemberDetail',
        components: {
            left: BlankPage,
            main: MemberInfoDetailPage,
        },children: [
          {path: '',redirect: '/mobileDashboard/MemberDetail/memberLeaveMessage'},
          {path: 'memberLeaveMessage',component: LeaveMessageDetail },
          {path: 'memberMedia',component: MediaDetailPage },
        ]

      },
      { path: 'publisherInfo',
        components: {
          left: BlankPage,
          main: PublisherInfoPage,
        },children: [
          {path: '',redirect: '/mobileDashboard/publisherInfo/memberLeaveMessage'},
          {path: 'memberLeaveMessage',component: LeaveMessageDetail },
          {path: 'memberMedia',component: MediaDetailPage },
        ]
      },
      {path: 'updateFile', components: {
          left: MemberLeftAsidePage,
          main: MemberUpdateFile,
      },children: [
          {path: '',redirect: '/mobileDashboard/updateFile/memberFile'},
          {path: 'memberFile',component: MemberFilePage },
          {path: 'memberFileUpdate',component: MemberUpdateFIlePage },
        ]
      },
      {path: 'recover', components: {
          left: BlankPage,
          main: RecoverPage,
      }},
      {path: 'edit', components: {
          left: BlankPage,
          main: BlogEditPage,
      }},
      {path: 'homeSearch', components: {
          left: BlankPage,
          main: HomeSearch,
      },children: [
          {path: '',redirect: '/mobileDashboard/homeSearch/searchBlog'},
          {path: 'searchBlog',component: SearchBlogDetail },
          {path: 'searchMember',component: SearchMemberDetail },
      ]},
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 不使用默认滚动行为，我们会手动控制
    return false;
  }
})

export default router
