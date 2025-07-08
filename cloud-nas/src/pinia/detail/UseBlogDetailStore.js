// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";

export const useBlogDetailStore = defineStore('useBlogStore', () => {

    const blogDetail = ref({
        id: '',
        memberId: '',
        avatar: '',
        nickName: '',
        textContent: '',
        createTime: '',
        isShowComment: false,
        commentNum: '',
        likeNum: '',
        isLike: false,
        isPublic: '',
        images: [],
        commentValue: '',
    })

    const comments = ref([

    ])

    const commentsLoading = ref(true)
    const hasMore = ref(true)
    const currentPage = ref(1)
    const getComments = async () => {
        try {
            const response = await mRequest.get("/comment/listByBlogId",{
                params: {
                    id: blogDetail.value.id,
                    currentPage: currentPage.value,
                    pageSize: 15
                }
            })
            if (response.data.code === 200) {
                if (response.data.data.length) {
                    if (currentPage.value === 1) {
                        comments.value = response.data.data
                        if (response.data.data.length < 15) {
                            hasMore.value = false
                            commentsLoading.value = false
                        }
                    } else {
                        comments.value = comments.value.concat(response.data.data)
                    }
                    currentPage.value += 1;
                } else {
                    hasMore.value = false
                    commentsLoading.value = false
                }
            } else {
                hasMore.value = false
                commentsLoading.value = false
                ElMessage({
                    type: "warning",
                    message: "拉取评论列表失败"
                })
                commentsLoading.value = false
            }
        } catch (e) {
            hasMore.value = false
            commentsLoading.value = false
            console.log(e.message)
        }
    }

    function reset() {
        blogDetail.value = null;
        currentPage.value = 1;
        hasMore.value = true
        commentsLoading.value = true;
        comments.value = [];
    }



    return {
        reset,
        blogDetail,
        commentsLoading,
        hasMore,
        getComments,
        comments
    }
},{

})