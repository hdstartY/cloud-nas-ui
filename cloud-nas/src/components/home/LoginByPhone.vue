<template>
  <div class="login-form">
    <div class="text-box">
      <div style="font-size: 55px;color: black">期待你</div>
      <div style="font-size: 30px;color: black;margin-top: 40px">现在就加入。</div>
      <div style="margin-top: 30px">
        <input type="text" placeholder="手机号" class="custom-input" v-model="form.phone">
      </div>
      <div style="margin-top: 20px">
        <input type="password" placeholder="密码" class="custom-input" v-model="form.password">
      </div>
      <div style="margin-top: 15px"><el-button round type="warning" size="large" style="width: 300px" @click="phoneLogin">登录</el-button></div>
      <div style="display: flex;margin-top: 5px"><div style="width: 140px;padding-top:5px "><hr></div><div style="width: 20px;font-size: 16px;align-items: center;color: black">或</div><div style="width: 140px; padding-top:5px "><hr></div></div>
      <div style="margin-top: 5px"><el-button round type="primary" size="large" style="width: 300px" @click="toEmailLogin">邮箱登录</el-button></div>
      <div style="margin-top: 10px"><el-button round type="success" size="large" style="width: 300px" @click="toRegister">创建账号</el-button></div>
      <div>
        <div style="margin-top: 30px;color: black">我是用户</div>
        <div style="margin-top: 10px"><el-button round type="primary" size="large" style="width: 300px" plain @click="toMemberLogin()">切换</el-button></div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import {ref} from "vue";
  import aRequest from "../../utils/AdminRequest.js";
  import {ElMessage} from "element-plus";
  import { useRouter } from 'vue-router'

  //// 变量区域
  const form = ref({
    phone: '',
    password: ''
  })
  const router = useRouter()

  ////函数区域


  const phoneLogin = async () => {
    try {
      const response = await aRequest.post('/admin/login',form.value)
      console.log('response:', response.data)
      // 你可以在这里保存 token、跳转页面等等
      if (response.data.code === 401) {
        ElMessage({
          message: response.data.msg,
          type: 'error',
          plain: true,
        })
      } else {
        localStorage.setItem('a_token',response.data.data.token)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error('登录失败:', error)
    }
  }
  // 表单验证规则
  const usernameRules = [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ]
  const passwordRules = [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
  //注册页面路由
  const toRegister = () => {
    router.push("/admin/register")
  }

  const toEmailLogin = () => {
    router.push('/admin/emailLogin')
  }

  const toMemberLogin = () => {
    router.push('/')
  }
</script>


<style scoped>
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