<template>
  <div class="login-form">
    <div class="text-box">
<!--      <div style="font-size: 55px;color: white">用户</div>-->
      <div style="font-size: 40px;color: black;margin-top: 40px">用户账号注册</div>
      <div style="margin-top: 30px">
        <input type="text" placeholder="昵称" class="custom-input" v-model="form.nickName">
      </div>
      <div style="margin-top: 20px">
        <input type="text" placeholder="手机号" class="custom-input" v-model="form.phone">
      </div>
      <div style="margin-top: 20px">
        <input type="text" placeholder="邮箱" class="custom-input" v-model="form.email">
      </div>
      <div style="margin-top: 20px">
        <input type="password" placeholder="密码" class="custom-input" v-model="form.password">
      </div>
      <div style="margin-top: 20px">
        <input type="password" placeholder="确认密码" class="custom-input" v-model="secondInputPassword">
      </div>
      <div style="margin-top: 15px"><el-button round type="warning" size="large" style="width: 300px" @click="register">注册</el-button></div>
      <div style="display: flex;margin-top: 5px"><div style="width: 140px;padding-top:5px "><hr></div><div style="width: 20px;font-size: 16px;align-items: center;color: black">或</div><div style="width: 140px; padding-top:5px "><hr></div></div>
      <div style="margin-top: 5px"><el-button round type="primary" size="large" style="width: 300px" @click="toPhoneLogin">去登陆</el-button></div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
  import {useRouter} from "vue-router";
  import mRequest from "../../../utils/MemberRequest.js";
  import {ElMessage} from "element-plus";

  var router = useRouter();

  const form = reactive({
    nickName: '',
    phone: '',
    email: '',
    password: '',
  })
  const secondInputPassword = ref('')

  const register = async () => {
    try {
      const response = await mRequest.post("/member/saveMember",form)
      console.log(response)
      if (response.data.code === 200) {
        ElMessage({
          type: 'success',
          message: '注册成功！',
        })

        router.push('/')
      } else {
        ElMessage.error(response.data.msg)
      }
    } catch (error) {
      console.log("handleRegister发生错误：" + error)
    }
  }

  const toPhoneLogin = () => {
    router.push('/');
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