<template>
 <div>
   <div style="background-color: rgba(220, 223, 230, 0.64);">
     <div style="width: 100%;height: 40px;border-bottom: 1px solid rgba(224,227,232);display: flex;background-color: white">
        <div class="clickable-text" style="width: 340px;height:40px;border-right: 1px solid rgba(224,227,232);display: flex;justify-content: center;align-items: center" @click="recoverStore.sortByTime = !recoverStore.sortByTime">
          时间<el-icon v-if="recoverStore.sortByTime === true"><arrow-down /></el-icon><el-icon v-if="recoverStore.sortByTime === false"><arrow-up /></el-icon>
        </div>
       <div style="width: 340px;display: flex;justify-content: center;align-items: center;">
         <el-select  v-model="recoverStore.selectedRange" style="width: 200px;border: none">
           <el-option label="近7天" value="7" />
           <el-option label="近30天" value="30" />
           <el-option label="近90天" value="90" />
         </el-select>
       </div>
     </div>
<!--     空白显示-->
     <div style="background-color: white;text-align: center;padding-top: 50px" v-if="recoverStore.recoverBlogList === null">
       <div style="font-size: 20px">空空如也~</div>
       <img style="width: 100%" src="http://47.109.93.230:9000/cloud-nas/nofollow.jpg">
     </div>
     <!--   卡片-->
     <div style=";width:100%;margin-top: 5px;background-color: white" v-for="item in recoverStore.recoverBlogList" :key="item.id">
       <div style="height: 50px;display: flex;flex-direction: row;align-items: center;padding-left: 20px">
         <el-avatar :src="item.avatar"/>
         <div style="width: 466px;margin-left: 10px">
           <div style="font-size: 15px">{{item.nickName}}</div>
           <div style="font-size: 12px">{{item.createTime}}</div>
         </div>
         <div style="height: 50px;width: 130px;display: flex;align-items: center;">
           <el-button @click="toResume(item.id)" style="width: 60px" type="success" round plain>恢复</el-button>
           <el-button @click="permanentlyDelete(item.id)" style="width: 60px;margin-left: 5px" type="danger" round plain>删除</el-button>
         </div>
       </div>

       <!-- 文字内容 -->
       <div class="message-content" style="color: rgb(51, 51, 51)">
         {{ item.textContent }}
       </div>

       <!-- 图片内容 -->
       <div class="img-content" v-if="item.images && item.images.length">
         <el-image
             v-for="(img, index) in item.images"
             :key="index"
             :src="img"
             class="post-image"
             fit="cover"
             :preview-src-list="item.images"
             :initial-index="index"
             preview-teleported
         />
       </div>
     </div>
   </div>
 </div>
</template>

<script setup>
import {ArrowDown, ArrowUp} from "@element-plus/icons-vue";
import {recoverShare} from "../../../../pinia/member/RecoverShare.js";
import {onMounted} from "vue";
import mRequest from "../../../../utils/MemberRequest.js";
import {ElMessage, ElMessageBox} from "element-plus";

const recoverStore = recoverShare()

onMounted(() => {
  recoverStore.fetchRecoverBlogList();
})

const toResume = async (blogId) => {
  const blogIds = []
  blogIds.push(blogId)
  try {
    const response = await mRequest.post("/blog/resumeByIds",blogIds)
    if (response.data.code === 200) {
      ElMessage({
        type: "success",
        message: "恢复成功"
      })
      recoverStore.fetchRecoverBlogList();
    } else {
      console.log(response.data.msg)
    }
  } catch (e) {
    console.log(e.message)
  }
}
const permanentlyDelete = async (blogId) => {
  ElMessageBox.confirm(
      `将永久删除，确认继续吗？`,
      '提示！不可恢复',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then( async () => {
    // 用户点击了“确定”
    try {
      const response = await mRequest.get("/blog/removeByIdP",{
        params: {
          blogId: blogId,
        }
      })
      if (response.data.code === 200) {
        ElMessage({
          type: 'success',
          message: '博客已永久性删除'
        })
        recoverStore.fetchRecoverBlogList();
      } else {
        ElMessage({
          type: "warning",
          message: "删除失败"
        })
      }
    } catch (e) {
      console.log(e.message)
    }
  }).catch(() => {
    // 用户点击了“取消”或关闭了对话框
  })
}
</script>

<style scoped>
.clickable-text {
  cursor: pointer;
  color: rgba(151, 151, 151);
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
.img-content {
  gap: 10px;
  margin-top: 10px;
  margin-left: 20px;
  width: 625px;
}
.post-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 5px;
}
.message-content {
  margin-left: 20px;
  width: 630px;
  font-size: 14px;
}
</style>