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
  <div style="width: 640px;padding-left: 20px;padding-right: 20px">
    <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        drag
        :limit="1"
        accept=".mp4,.mov"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-exceed="handleExceed"
        :auto-upload="false"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将视频拖拽到这里<em> 或点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip" style="color: red">
          注：仅支持MP4,MOV格式视频文件且大小小于200MB
        </div>
      </template>
    </el-upload>
  </div>
  <div style="padding-left: 20px">
    <div style="color: rgb(111, 120, 176);font-size: 14px">自定义封面</div>
    <div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import type { UploadProps, UploadUserFile } from 'element-plus'
import {UploadFilled} from "@element-plus/icons-vue";

const fileList = ref<UploadUserFile[]>([

])
const form = reactive({
  memberId: '',
  isPublic: '1',
  textContent: '',
})


const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage({
    type: 'warning',
    message: '单次只能上传一个视频，请删除原视频后重新选择'
  })
}

const beforeRemove: (uploadFile, uploadFiles) => Promise<boolean> = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
      `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
      () => true,
      () => false
  )
}
</script>
