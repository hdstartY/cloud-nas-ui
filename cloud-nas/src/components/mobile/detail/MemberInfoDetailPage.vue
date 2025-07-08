<template>
<!--  总块-->
  <div>
<!--    头像和背景块-->
    <div @click="toChangeBackImg" class="back-img" :style="`background-image: url(${fanForm.backImg})`" style="cursor: pointer">

    </div>
<!--    个人信息-->
    <div style="height: 100px;margin-top: 5px;">
      <div style="padding-left: 20px;display: flex;">
        <div style="width: 95px;height: 95px;display:flex;">
          <el-avatar @click="changeAvatar"  class="avatar avatar-info" :src="memberStore.avatarUrl"></el-avatar>
        </div>
        <div style="width: 430px;padding-left: 10px;display: flex;flex-direction: column;justify-content: center">
          <!--      昵称-->
          <div style="height: 30px;width: 100%;">
            <div style="height: 30px;width: auto;margin: 0 auto">
              <div style="width:100%;font-size: 20px;display:flex;align-items: center;font-size: 20px">
                {{memberStore.memberNickName}}
              </div>
            </div>
          </div>
          <!--      粉丝等-->
          <div style="height: 30px;width: 100%;">
            <div style="margin: 0 auto;height: 30px;display: flex;flex-direction: row;font-size: 15px">
              <div class="text" style="height: 100%;align-content: center;margin-right: 10px">
                关注:{{fanForm.followCounts}}
              </div>
              <div class="text" style="height: 100%;align-content: center">
                粉丝:{{fanForm.fanCounts}}
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;align-items: center;">
          <el-button @click="changeNickName" type="info" plain>编辑资料</el-button>
        </div>
      </div>
<!--      个性签名等-->
      <div style="height: 50px;width: 100%;margin-top: 5px;font-size: 14px;color: #424040;padding-left: 20px">
        <div v-if="fanForm.signature !== null">个性签名: {{fanForm.signature}}</div>
        <div v-if="fanForm.signature === null">个性签名: 空空如也~</div>
        <div v-if="fanForm.other !== null">其它: {{fanForm.other}}</div>
        <div v-if="fanForm.other === null">其它: 空空如也~</div>
      </div>
<!--      内容选项-->
      <div style="width: 100%;height: 40px;display: flex;flex-direction: row;justify-content: space-between;font-size: 16px;border-top: 1px solid rgba(224,227,232,0.6);border-bottom: 1px solid rgba(224,227,232,0.6)">
        <div @click="toMyMessage" class="clickable-text" :class="{'clickable-text-selected':selectItem === 1}" style="width: 340px;text-align: center;padding-top: 10px;border-right: 1px solid rgba(224,227,232,0.6)">
          我的留言
        </div>
        <div @click="toMyMedia" class="clickable-text" :class="{'clickable-text-selected':selectItem === 2}" style="width: 340px;text-align: center;padding-top: 10px">
          相册
        </div>
      </div>
<!--      内容-->
      <div style="width: 100%;margin-top: 5px;">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <el-drawer style="background-color: rgb(255,255,255,0.3);" v-model="drawer" title="I am the title" :with-header="false">
    <div>
<!--      标题-->
      <div  v-if="changeStatus === 1" style="text-align: center;font-size: 20px;margin-bottom: 20px">更换头像</div>
      <div  v-if="changeStatus === 2" style="text-align: center;font-size: 20px;margin-bottom: 20px">更换背景</div>
      <div  v-if="changeStatus === 3" style="text-align: center;font-size: 20px;margin-bottom: 20px">改变签名信息</div>
<!--      输入及展示-->
      <div v-if="changeStatus === 1 || changeStatus === 2" style="width:100%;display:flex;justify-content: center;height: 500px;">
        <div @click="changeAvatarFile" class="img-box" style="border: 1px dotted gray;width: 500px;height: 500px;display: flex;align-items: center;justify-content: center">
          <div v-if="imgShowStatus === 1"><img v-if="avatarUrl !== ''" style="width: 500px;height: 500px" :src="avatarUrl"></div>
          <div v-if="imgShowStatus === 2"><img v-if="backImgUrl !== ''" style="width: 500px;height: 500px" :src="backImgUrl"></div>
        </div>
      </div>
      <div v-if="changeStatus === 3">
<!--        昵称-->
        <div style="width: 100%;display: flex;justify-content: center">
          <el-input
              v-model="otherInfo.nickName"
              style="width: 400px"
              placeholder="昵称"
              clearable
          />
          <el-button @click="cleanNickName" round plain type="warning" style="margin-left: 10px">清空</el-button>
        </div>
        <div style="width: 100%;display: flex;justify-content: center;margin-top: 20px">
          <el-input
              v-model="otherInfo.signature"
              style="width: 400px"
              placeholder="签名"
              clearable
              type="textarea"
          />
          <el-button @click="cleanSignature" round plain type="warning" style="margin-left: 10px">清空</el-button>
        </div>
        <div style="width: 100%;display: flex;justify-content: center;margin-top: 20px">
          <el-input
              v-model="otherInfo.other"
              style="width: 400px"
              placeholder="其它"
              clearable
              type="textarea"
          />
          <el-button @click="cleanOther" round plain type="warning" style="margin-left: 10px">清空</el-button>
        </div>
        <div style="margin-top: 20px;display: flex;justify-content: center;padding-right: 70px;">
          <el-button @click="changeOtherInfo" plain round type="success">上传</el-button>
        </div>
      </div>
<!--      操作-->
      <div v-if="changeStatus ===1 || changeStatus === 2" style="display:flex;justify-content: center;margin-top: 20px">
        <el-button @click="cleanImgFile" style="width: 80px" round plain type="warning">清空</el-button>
        <el-button @click="updateImgFile" style="width: 80px" round plain type="success">上传</el-button>
      </div>
<!--      隐式文件上传组件-->
      <input
          ref="fileInputRef"
          type="file"
          accept=".jpg,.png"
          @change="handleFileChange"
          style="display: none"
      />
    </div>
  </el-drawer>
</template>

<script setup>
import {EditPen, Plus, Promotion, ZoomIn} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import mRequest from "../../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";
import {memberInfoShare} from '../../../pinia/member/MemberInfoShare.js'

onMounted(() => {
  getFanDetailCounts()
})

const memberInfo = ref({

})

const cleanNickName = () => {
  otherInfo.value.nickName = ''
}
const cleanSignature = () => {
  otherInfo.value.signature = ''
}
const cleanOther = () => {
  otherInfo.value.other = ''
}

const memberStore = memberInfoShare();

const fanForm = ref({
  fanCounts: '',
  followCounts: '',
  backImg: '',
  signature: '',
  other: ''
})

const otherInfo = ref({
  memberId: '',
  nickName: '',
  signature: '',
  other: ''
})

const changeOtherInfo = async () => {
  if (otherInfo.value.nickName === '' && otherInfo.value.signature === '' && otherInfo.value.other === '') {
    ElMessage({
      type: "warning",
      message: "不能都为空！"
    })
    return;
  }
  if (otherInfo.value.nickName === memberStore.memberNickName || otherInfo.value.signature === fanForm.value.signature && otherInfo.value.other === fanForm.value.other) {
    ElMessage({
      type: "warning",
      message: "不能与原内容一样！"
    })
    return;
  }
  try {
    otherInfo.value.memberId = memberStore.memberId
    const response = await mRequest.post("otherInfo/changeOtherInfo", otherInfo.value);
    if (response.data.code === 200) {
      if (otherInfo.value.signature !== '') {
        fanForm.value.signature = otherInfo.value.signature
      }
      if (otherInfo.value.other !== '') {
        fanForm.value.other = otherInfo.value.other
      }
      if (otherInfo.value.nickName !== '') {
        memberStore.memberNickName = otherInfo.value.nickName;
      }
      otherInfo.value.nickName = ''
      otherInfo.value.signature = ''
      otherInfo.value.other = ''
      ElMessage({
        type: "success",
        message: "修改成功！"
      })
    } else {
      ElMessage({
        type: "warning",
        message: response.data.msg
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

const getFanDetailCounts = async () => {
  try {
    const response = await mRequest.get("follow/getFansCountsAndOther", {
      params: {
        memberId: memberStore.memberId,
      }
    })
    if (response.data.code === 200) {
      fanForm.value = response.data.data
      backImgUrl.value = fanForm.value.backImg
    } else {
      ElMessage({
        type: "warning",
        message: response.data.msg
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

const imgShowStatus = ref(1)
const router = useRouter();
const selectItem = ref(1)
const drawer = ref(false)
// 头像文件和 URL
const imgFile = ref(null)
const avatarUrl = ref('')
// 文件 input 的 ref 引用
const fileInputRef = ref(null)
const changeStatus = ref(1)

const backImgUrl = ref('')
const toChangeBackImg = () => {
  changeStatus.value = 2;
  imgShowStatus.value = 2;
  drawer.value = true;
}

const changeNickName = () => {
  changeStatus.value = 3;
  drawer.value =true;
}

const updateImgFile = () => {
  if (changeStatus.value === 1) {
    updateAvatarFile();
  } else if (changeStatus.value === 2) {
    updateBackImgFile();
  }
}
const updateAvatarFile = async () => {
  if (avatarUrl.value !== '' && avatarUrl.value !== localStorage.getItem('avatarUrl') && imgFile.value !== null) {
    const formData = new FormData();
    formData.append("memberId",memberStore.memberId)
    formData.append("avatarUrl",memberStore.avatarUrl)
    formData.append("imgFile", imgFile.value);
    try {
      const response = await mRequest.post("member/updateAvatar", formData)
      if (response.data.code === 200) {
        ElMessage({
          type: "success",
          message: "上传成功"
        })
        memberStore.avatarUrl = response.data.data.avatarUrl
        avatarUrl.value = response.data.data.avatarUrl
      } else {
        ElMessage({
          type: "warning",
          message: response.data.msg
        })
      }
    } catch (e) {
      ElMessage({
        type: "error",
        message: "未知错误"
      })
      console.log(e.message)
    }
  } else {
    ElMessage({
      type: "warning",
      message: "请上传文件"
    })
  }
}
const updateBackImgFile = async () => {
  if (fanForm.value.backImg !== '' && fanForm.value.backImg !== backImgUrl.value && imgFile.value !== null) {
    const formData = new FormData();
    formData.append("memberId",memberStore.memberId)
    formData.append("backImgUrl",backImgUrl.value)
    formData.append("imgFile", imgFile.value);
    try {
      const response = await mRequest.post("member/updateBackImg", formData)
      if (response.data.code === 200) {
        ElMessage({
          type: "success",
          message: "上传成功"
        })
        backImgUrl.value = response.data.data.backImgUrl
        fanForm.value.backImg = response.data.data.backImgUrl
      } else {
        ElMessage({
          type: "warning",
          message: response.data.msg
        })
      }
    } catch (e) {
      ElMessage({
        type: "error",
        message: "未知错误"
      })
      console.log(e.message)
    }
  } else {
    ElMessage({
      type: "warning",
      message: "请上传文件"
    })
  }
}

const changeAvatar = () => {
  avatarUrl.value = memberStore.avatarUrl
  changeStatus.value = 1;
  imgShowStatus.value = 1;
  drawer.value = true;
}
const changeAvatarFile = () => {
  fileInputRef.value?.click()
}
const handleFileChange = (e) => {
  // 安全地处理文件变更
  const input = e.target
  if (input?.files && input.files.length > 0) {
    const file = input.files[0]
    imgFile.value = file
    if (changeStatus.value === 1) {
      avatarUrl.value = URL.createObjectURL(file)
    } else {
      backImgUrl.value = URL.createObjectURL(file)
    }
  }
}
const cleanImgFile = () => {
  if (changeStatus.value === 1) {
    if (avatarUrl.value === memberStore.avatarUrl) {
      ElMessage({
        type: "warning",
        message: "当前头像为你所使用头像，无法清空!"
      })
      return;
    }
    avatarUrl.value = ''
  } else if (changeStatus.value === 2) {
    if (backImgUrl.value === fanForm.value.backImg) {
      ElMessage({
        type: "warning",
        message: "当前头像为你所使用背景，无法清空!"
      })
      return;
    }
    avatarUrl.value = ''
  }
}
const toMyMessage = () => {
  selectItem.value = 1;
  router.push("/mobileDashboard/MemberDetail/memberLeaveMessage")
}
const toMyMedia= () => {
  selectItem.value = 2;
  router.push("/mobileDashboard/MemberDetail/memberMedia")
}
</script>

<style scoped>
.back-img {
  height: 382px;
  width: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
}
.avatar-info {
  width: 90px;
  height: 90px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.img-box:hover {
  box-shadow: 0 0 0 5px rgba(135, 206, 250, 0.5);
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
.clickable-text {
  cursor: pointer;
  color: rgb(114, 111, 111);
  transition: color 0.3s;
  font-size: 16px;
  font-weight: 500;
}
.clickable-text:hover {
  color: skyblue;
}
.clickable-text-selected {
  color: skyblue;
}
.text {
  color: gray;
  cursor: pointer;
}
.text:hover {
  color: skyblue;
}
</style>