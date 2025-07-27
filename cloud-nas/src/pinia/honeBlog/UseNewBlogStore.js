// src/stores/blog.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";

export const useNewBlogStore = defineStore('useNewBlogStore', () => {

    const currentPage = ref(1);
    const hasMore = ref(true);
    const loading = ref(true)

    // 触发刷新
    const blogList = ref([
        // {
        //     id: '',
        //     memberId: '',
        //     avatar: '',
        //     nickName: '',
        //     textContent: '',
        //     createTime: '',
        //     isShowComment: false,
        //     commentNum: '',
        //     likeNum: '',
        //     isLike: false,
        //     isPublic: '',
        //     images: [],
        //     commentValue: '',
        // },
    ])

    async function fetchBlogsBySort() {
        // 请求
        try {
            const response = await mRequest.get("/blog/list",{
                params: {
                    currentPage: currentPage.value,
                    pageSize: 20,
                    orderType: 'b.create_time',
                }
            })
            if (response.data.code === 200) {
                if (response.data.data === null) {
                    loading.value = false
                    hasMore.value = false
                } else {
                    if (currentPage.value === 1) {
                        blogList.value = response.data.data
                        currentPage.value += 1;
                    } else {
                        blogList.value = blogList.value.concat(response.data.data);
                        currentPage.value += 1;
                    }
                    if (response.data.data.length < 20) {
                        loading.value = false;
                        hasMore.value = false;
                    }
                }
            } else {
                console.log(response.data.msg)
            }
        } catch (error) {
            ElMessage({
                type: 'error',
                message: error.message
            })
        }
    }

    const isTOBlogDetail = ref(false)
    function reset() {
        blogList.value = []
        loading.value = true
        hasMore.value = true;
    }

    return {
        blogList,
        hasMore,
        loading,
        reset,
        fetchBlogsBySort,
        currentPage,
        isTOBlogDetail
    }



},{
})