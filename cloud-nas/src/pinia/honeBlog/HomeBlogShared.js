// src/stores/blog.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";

export const homeBlogStore = defineStore('blog', () => {

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
        //     comments: [
        //         {
        //             id: '',
        //             memberId: '',
        //             avatar: '',
        //             commentNickName: '',
        //             createTime: '',
        //             textContent: '',
        //             likeNum: ''
        //         }
        //     ]
        // },
    ])

    const isCover = ref(false);
    async function fetchBlogs() {
        loading.value = true;
        // 请求
        try {
            const response = await mRequest.get("/blog/getBlogVosByCache",{
                params: {
                    currentPage: currentPage.value
                }
            })
            if (response.data.code === 200) {
                if (response.data.data === null) {
                    loading.value = false
                    hasMore.value = false
                    return;
                }
                if (currentPage.value === 1 || isCover.value) {
                    blogList.value = response.data.data
                    isCover.value = false
                    currentPage.value += 1;
                } else {
                    blogList.value = blogList.value.concat(response.data.data);
                    currentPage.value += 1;
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

    const sortCurrentPage = ref(1);
    const sortField = ref('default') // 默认排序
    async function fetchBlogsBySort() {
        loading.value = true;
        // 请求
        try {
            const response = await mRequest.get("/blog/list",{
                params: {
                    currentPage: sortCurrentPage.value,
                    pageSize: 20,
                    orderType: sortField.value,
                }
            })
            if (response.data.code === 200) {
                if (response.data.data === null) {
                    loading.value = false
                    hasMore.value = false
                    return;
                }
                if (sortCurrentPage.value === 1 || isCover.value === false) {
                    blogList.value = response.data.data
                    isCover.value = true;
                    sortCurrentPage.value += 1;
                } else {
                    blogList.value = blogList.value.concat(response.data.data);
                    sortCurrentPage.value += 1;
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

    function reset() {
        sortField.value = 'default'
        blogList.value = []
        loading.value = true
        currentPage.value = 1;
        hasMore.value = true;
    }

    // 监听排序字段变化，自动请求数据
    watch(sortField, () => {
        if (sortField.value === 'default') {
            fetchBlogs()
        } else {
            fetchBlogsBySort()
        }
    })



    return {
        sortField,
        blogList,
        hasMore,
        loading,
        reset,
        fetchBlogs,
        fetchBlogsBySort,
    }



},{

})