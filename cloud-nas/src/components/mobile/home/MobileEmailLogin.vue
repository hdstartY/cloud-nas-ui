<template>
  <div class="login-form">
    <div class="text-box">
      <div style="font-size: 55px;color: black">期待你</div>
      <div style="font-size: 30px;color: black;margin-top: 40px">现在就加入。</div>
      <div style="margin-top: 30px">
        <input @keyup.enter="mobileEmailLogin" type="text" placeholder="邮箱" class="custom-input" v-model="form.email">
      </div>
      <div style="margin-top: 20px">
        <input @keyup.enter="mobileEmailLogin" type="password" placeholder="密码" class="custom-input" v-model="form.password">
      </div>
      <div style="margin-top: 15px"><el-button round type="warning" size="large" style="width: 300px" @click="mobileEmailLogin">登录</el-button></div>
      <div style="display: flex;margin-top: 5px"><div style="width: 140px;padding-top:5px "><hr></div><div style="width: 20px;font-size: 16px;align-items: center;color: black">或</div><div style="width: 140px; padding-top:5px "><hr></div></div>
      <div style="margin-top: 5px"><el-button round type="primary" size="large" style="width: 300px" @click="toPhoneLogin">手机登录</el-button></div>
      <div style="margin-top: 10px"><el-button round type="success" size="large" style="width: 300px" @click="toRegister">创建账号</el-button></div>
      <div>
        <div style="display:flex;width: 300px;justify-content: space-between">
          <div style="margin-top: 30px;color: black">管理员身份？</div>
          <div style="margin-top: 30px;" class="forgotPassword">忘记密码？</div>
        </div>
        <div style="margin-top: 10px"><el-button round type="primary" size="large" style="width: 300px" plain @click="toAdminLogin()">切换</el-button></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {useRouter} from "vue-router";
  import mRequest from "../../../utils/MemberRequest.js";
  import {ElMessage} from "element-plus";
  import {reactive} from "vue";
  import {memberInfoShare} from "../../../pinia/member/MemberInfoShare.js";

  var router = useRouter();

  const memberStore = memberInfoShare();
  const form = reactive({
    email: '',
    password: '',
  })

  const mobileEmailLogin = async () => {
    try {
      const response = await mRequest.post("/member/loginByEmail",form);
      if (response.data.code === 200) {
        ElMessage({
          type: 'success',
          message: response.data.msg,
        })
        localStorage.setItem('m_token',response.data.data.token)
        memberStore.memberId = response.data.data.id
        memberStore.avatarUrl = response.data.data.avatarUrl
        memberStore.memberNickName = response.data.data.nickName
        router.push('/mobileDashboard')
      }else {
        ElMessage({
          type: 'error',
          message: response.data.msg,
        })
      }
    } catch (error) {
      console.log("错误: " + error)
    }
  }

  const toPhoneLogin = () => {
    router.push('/phoneLogin');
  }
  const toRegister = () => {
    router.push('/register')
  }
  const toAdminLogin = () => {
    router.push('/admin')
  }

</script>

<style scoped>
.forgotPassword{
  cursor: pointer;
  color: orange;
}
.forgotPassword:hover{
  color: skyblue;
}
.login-form {
  height: 600px;
  width: 400px;
}
.text-box {
  height: 185px;
  width: 100%;
}
.custom-input {
  width: 300px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  padding: 0 12px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #fff;
}
.custom-input:focus {
  border-color: #409EFF; /* Element 的主色 */
  box-shadow: 0 0 3px rgba(64, 158, 255, 0.5);
}
</style>