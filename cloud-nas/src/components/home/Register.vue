<template>
  <div class="login-form">
    <div class="text-box">
      <!--      <div style="font-size: 55px;color: white">用户</div>-->
      <div style="font-size: 40px;color: black;margin-top: 40px">管理员账号注册</div>
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
      <div style="margin-top: 5px"><el-button round type="primary" size="large" style="width: 300px" @click="toLogin">去登陆</el-button></div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
  import {useRouter} from "vue-router";
  import aRequest from "../../utils/AdminRequest.js";
  import {ElMessage} from "element-plus";

  const router = useRouter()
  //// 变量区域
  const form = reactive({
    phone: '',
    email: '',
    password: '',
  })
  const secondInputPassword = ref('')


  ////函数区域
  const register = async () => {
    if (form.phone == '' || form.password == '') {
      ElMessage.error("手机号和密码不能为空")
      console.log("手机号和密码不能为空")
      return;
    }
    if (form.phone.length != 11 || form.password.length < 8) {
      ElMessage.error("手机号11位，密码大于8位")
      return;
    }

    try {
       const response = await aRequest.post("/admin/register",form)
      if (response.data.code === 200) {
        ElMessage({
          type: 'success',
          message: response.data.data.msg,
        })

        router.push('/admin/phoneLogin')
      } else {
        ElMessage.error(response.data.msg)
      }
    } catch (error) {
      console.log("handleRegister发生错误：" + error)
    }


  }
  const toLogin = () => {
    router.push("/admin/phoneLogin")
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