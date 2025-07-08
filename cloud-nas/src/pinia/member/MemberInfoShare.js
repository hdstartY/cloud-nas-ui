// src/stores/blog.js
import {defineStore} from 'pinia'
import {ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";

export const memberInfoShare = defineStore('member', () => {
        const memberId = ref()
        const avatarUrl = ref('')
        const memberNickName = ref('')

        async function demo() {
            // 请求
            try {
                const response = await mRequest.get("/blog/list", {
                    params: {
                        orderType: sortField.value
                    }
                })
                console.log(response.data)
                if (response.data.code === 200) {
                    blogList.value = response.data.data
                    loading.value = false
                } else {
                    ElMessage({
                        type: 'warning',
                        message: response.data.msg
                    })
                }
            } catch (error) {
                ElMessage({
                    type: 'error',
                    message: error.message
                })
            }
        }

        function reset() {
            memberId.value = ''
            avatarUrl.value = ''
            memberNickName.value = ''
        }

        // 监听排序字段变化，自动请求数据

        return {
            memberId,
            avatarUrl,
            memberNickName,
            reset
        }
    },
    {
        persist: true
    }
)