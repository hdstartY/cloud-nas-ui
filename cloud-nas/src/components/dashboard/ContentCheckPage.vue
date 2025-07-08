<template>
  <div style="font-size: 20px;text-align: center;padding-top: 50px" v-if="contentForm.length === 0">当前没有需要审核的内容</div>
  <div  v-if="contentForm.length !== 0" class="check-main">
<!--    标题-->
    <div class="check-nav">
      <div class="check-nav-item" style="width: 400px;border-right: 1px solid rgba(160,161,169,0.37);">文章</div>
      <div class="check-nav-item" style="width: calc(100vw - 830px)">媒体</div>
      <div class="check-nav-item" style="width: 225px;border-left: 1px solid rgba(160,161,169,0.37)">操作</div>
    </div>
<!--    卡片-->
    <div style="display: flex;background-color: white;flex-direction: row;border-bottom: 1px solid rgba(160,161,169,0.37);" v-for="item in contentForm" :key="item.id">
<!--      文字内容-->
      <div style="width: 400px;border-right: 1px solid rgba(160,161,169,0.37);">
        {{item.textContent}}
      </div>
<!--      图片内容-->
      <div style="width: calc(100vw - 830px);margin-top: 5px;margin-bottom: 5px">
        <el-image
            v-for="(img, index) in item.images"
            :key="index"
            :src="img"
            class="check-image"
            fit="cover"
            :preview-src-list="item.images"
            :initial-index="index"
            preview-teleported
        />
      </div>
<!--      操作-->
      <div style="width: 225px;border-left: 1px solid rgba(160,161,169,0.37);">
        <div style="height: 100%;display: flex;align-items: center;justify-content: center;flex-direction: column;">
          <div style="margin-top: 5px;width: 100%;display: flex;justify-content: center">
            <el-button style="width: 87px" type="warning" plain round>不通过</el-button>
            <el-button @click="passContent(item.id)" style="width: 87px" type="success" plain round>通过</el-button>
          </div>
          <div style="margin-top: 5px;width: 100%;display: flex;justify-content: center">
            <el-button style="width: 87px" type="primary" plain round>发送消息</el-button>
            <el-button style="width: 87px" type="danger" plain round>封禁账号</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import memberRequest from "../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";

onMounted(() => {
  getCheckContent();
})

const contentForm = ref([])

const passContent = async (blogId) => {
  try {
    const response = await memberRequest.get("/check/passContent",{
      params: {
        blogId: blogId
      }
    })
    if (response.data.code === 200) {
      ElMessage({
        type: "success",
        message: "操作成功"
      })
      contentForm.value = contentForm.value.filter(content => content.id !== blogId)
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

const getCheckContent = async () => {

  try {
    const response = await memberRequest.get("/check/getCheckContent")
    if (response.data.code === 200) {
      contentForm.value = response.data.data
    } else {
      console.log(response.data.msg)
    }
  } catch (e) {
    console.log(e.message)
  }
}
</script>

<style scoped>
.check-main {
  height: 100%;
  width: 100%;
}
.check-nav {
  height: 40px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(160,161,169,0.37);
}
.check-nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.check-image {
  height: 130px;
  width: 130px;
}
</style>