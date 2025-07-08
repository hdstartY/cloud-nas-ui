<template>
  <div style="font-size: 20px;padding-left: 10px;border-bottom: 1px solid rgba(224,227,232,0.6)" @click="comeBack()">
    <div class="clickable-text" style=" font-size: 20px;display: flex;align-items: center"><el-icon><arrow-left-bold /></el-icon>返回</div>
  </div>
  <div style="padding: 20px;background-color: white">
    <el-form label-width="auto" style="max-width: 600px">
      <el-form-item label="描述">
        <el-input v-model="memberEditStore.memberEditBlog.textContent" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
  <div style="display: flex;flex-direction: row;padding-left: 20px;" v-if= "memberEditStore.memberEditBlog.images">
    <div style="width: 40px">
      <el-text style="font-size: 14px">原图</el-text>
    </div>
    <div  v-for="(img, index) in memberEditStore.memberEditBlog.images" :key="index">
      <div style="margin-bottom: 5px"><img class="post-image" :src="img"></div>
      <div style="width: 153px;display: flex;justify-content: center"><el-button @click="toRemove(index)" type="danger" plain round>删除</el-button></div>
    </div>
  </div>
  <div style="display: flex;padding: 20px">

    <div style="width: 40px">
      <el-text style="font-size: 14px">上传</el-text>
    </div>
    <div style="">
      <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          v-model:file-list="fileList"
          :on-change="handChange"
          :multiple="true"
          :limit="12"
      >
        <el-icon><Plus /></el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
          </div>
        </template>
      </el-upload>

      <el-dialog v-model="dialogVisible" width="60%">
        <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%; max-height: 80vh; object-fit: contain;" />
      </el-dialog>
    </div>
  </div>
  <div style="text-align: center;margin-top: 20px">
    <el-button type="success" @click="publish()">更新</el-button>
    <el-button type="danger">清空</el-button>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import {ArrowLeftBold, Delete, Download, Plus, ZoomIn} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {memberInfoShare} from "../../../pinia/member/MemberInfoShare.js";
import {drectionStatusStore} from "../../../pinia/honeBlog/DirectionStatusShare.js";
import mRequest from "../../../utils/MemberRequest.js";
import {memberEditBlogShare} from "../../../pinia/member/MemberEditBlogShare.js";
import {useRouter} from "vue-router";


const memberInfoStore = memberInfoShare()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const fileList = ref([])
const dereactionStore = drectionStatusStore()
const memberEditStore = memberEditBlogShare()
const router = useRouter()

onMounted(() => {
  textContent.value = memberEditStore.memberEditBlog.textContent
})

const removeImgItems = ref([])
const toRemove = (index) => {
  removeImgItems.value.push(memberEditStore.memberEditBlog.images[index])
  memberEditStore.memberEditBlog.images.splice(index, 1)
  console.log(removeImgItems.value)
}

const textContent = ref('')

const comeBack = () => {
  router.back();
}

const publish = async () => {
  if (memberEditStore.memberEditBlog.textContent === textContent.value && removeImgItems.value.length === 0 && fileList.value.length === 0) {
    ElMessage({
      type: "warning",
      message: "无修改内容！"
    })
    return;
  }

  const formData = new FormData()

  // 添加文字类字段
  formData.append("blogId",memberEditStore.memberEditBlog.id)
  if (memberEditStore.memberEditBlog.textContent !== textContent.value) {
    formData.append('textContent', memberEditStore.memberEditBlog.textContent)
  }
  if (removeImgItems.value.length > 0) {
    formData.append('removeImgUrls', removeImgItems.value)
  }
  // 添加图片文件
  fileList.value.forEach((file) => {
    formData.append('images', file.raw)  // 后端用 @RequestParam("images")
  })

  //发请求
  try {
    const response = await mRequest.post('/blog/updateBlog', formData)
    if (response.data.code === 200) {
      ElMessage({
        type: "success",
        message: "更新成功"
      })
      dereactionStore.memberBlogDerection = 1;
      router.push("/mobileDashboard/memberBlog")
    }else {
      ElMessage({
        type: "error",
        message: response.data.data.msg
      })
    }
  } catch (e) {
    ElMessage({
      type: "error",
      message: "更新失败！"
    })
  }
}

const handChange = (uploadFIle,uploadFiles) => {
  fileList.value = uploadFiles
  console.log(fileList.value)
}

const handleRemove = (file) => {
  fileList.value = fileList.value.filter(f => f.uid !== file.uid)
  console.log(fileList.value)
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const handleDownload = (file) => {
  console.log(file)
}
</script>

<style scoped>
.post-image {
  width: 148px;
  height: 148px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 5px;
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
</style>