import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'

export const useVideoPlayStore = defineStore('useVideoPlayStore', () => {

    const id = ref()
    const oriUrl = ref('')
    const introduce = ref('')
    const memberId = ref()
    const likeNum = ref()
    const commentNum = ref()
    const createTime = ref()
    const avatar = ref()
    const nickName = ref()

    const comments = ref([])
    const loading = ref(true)
    const hasMore = ref(true)

    async function getComments() {
        alert("HUO")
        loading.value = false;
        hasMore.value = false
    }

    function reset() {
        id.value = '',
        oriUrl.value = '';
        introduce.value = ''
        memberId.value = ''
        likeNum.value = ''
        commentNum.value = ''
        createTime.value = ''
        avatar.value = ''
        nickName.value = ''
        loading.value = true;
        hasMore.value = true;
        comments.value = []
    }



    return {
        id,
        oriUrl,
        introduce,
        memberId,
        likeNum,
        commentNum,
        createTime,
        avatar,
        nickName,
        comments,
        loading,
        hasMore,
        reset,
        getComments,
    }
},{
    persist: true
})