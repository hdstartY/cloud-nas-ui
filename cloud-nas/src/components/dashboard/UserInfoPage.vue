<template>
  <el-table
      :data="tableData"
      border
      style="width: 100%"
      row-key="id"
      @selection-change="handleSelectionChange"
      v-loading="loading"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="nickName" label="昵称" width="180" />
    <el-table-column prop="phone" label="手机" width="120" />
    <el-table-column prop="email" label="邮箱" />
    <el-table-column prop="createTime" label="创建时间" width="120" />
    <el-table-column label="操作" width="150px">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          Edit
        </el-button>
        <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue'
import mRequest from "../../utils/MemberRequest.js";

onMounted(() => {
  fetchData()
})

// 表格数据
const tableData = ref([])
const loading = ref(true)
// 选中的 ID 数组
const selectedIds = ref([])

// 获取后端数据
const fetchData = async () => {
  try {
    const response = await mRequest.get("/member/list")
    console.log(response)
    tableData.value = response.data.data
    loading.value = false
  } catch (error) {
    console.log("错误：" + error)
  }
}

// 复选框选中事件
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
  console.log('选中的ID:', selectedIds.value)
}

// 操作按钮事件
const handleEdit = (index, row) => {
  console.log('编辑:', row)
}

const handleDelete = (index, row) => {
  console.log('删除:', row)
}
</script>
