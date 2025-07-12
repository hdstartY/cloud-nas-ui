// src/stores/blog.js
import {defineStore} from 'pinia'
import {ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";

export const memberInfoShare = defineStore('member', () => {
        const memberId = ref()
        const avatarUrl = ref('')
        const memberNickName = ref('')

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