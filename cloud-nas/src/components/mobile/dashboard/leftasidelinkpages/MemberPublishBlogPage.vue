<template>
  <div style="padding: 20px;background-color: white">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="状态">
        <el-radio-group v-model="form.isPublic">
          <el-radio value="1">公开</el-radio>
          <el-radio value="0">私密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.textContent" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
  <div style="display: flex;padding: 20px">
    <div style="width: 40px">
      <el-text style="font-size: 14px">图片</el-text>
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
    <el-button type="success" @click="publish()">发布</el-button>
    <el-button type="danger">清空</el-button>
  </div>
</template>

<script lang="js" setup>
  import {onMounted, reactive, ref} from 'vue'
  import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
  import mRequest from '../../../../utils/MemberRequest'
  import {ElMessage} from "element-plus";
  import router from "../../../../router/index.js";
  import {memberInfoShare} from "../../../../pinia/member/MemberInfoShare.js";
  import {drectionStatusStore} from "../../../../pinia/honeBlog/DirectionStatusShare.js";
  import {memberBlogShare} from "../../../../pinia/member/MemberBlogShare.js";

  const form = reactive({
    memberId: '',
    isPublic: '1',
    textContent: '',
  })
  const memberStore = memberInfoShare()
  const memberBlogStore = memberBlogShare()
  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)
  const disabled = ref(false)
  const fileList = ref([])
  const dereactionStore = drectionStatusStore()

  onMounted(() => {
    form.memberId = memberStore.memberId
  })

  const publish = async () => {
    const formData = new FormData()

    // 添加文字类字段
    formData.append('memberId', form.memberId)
    formData.append('isPublic', form.isPublic)
    formData.append('textContent', form.textContent)

    // 添加图片文件
    fileList.value.forEach((file) => {
      formData.append('images', file.raw)  // 后端用 @RequestParam("images")
    })

    console.log(formData.getAll("images"))

    //发请求
    try {
      const response = await mRequest.post('/blog/publishBlog', formData)
      if (response.data.code === 200) {
        ElMessage({
          type: "success",
          message: form.isPublic === 1 ? "发布成功将送入审核" : "发布成功"
        })
        dereactionStore.memberBlogDerection = 1;
        memberBlogStore.reset();
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
        message: "上传失败！"
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
