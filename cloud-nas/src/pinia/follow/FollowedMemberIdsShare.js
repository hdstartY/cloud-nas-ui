// src/stores/blog.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {ElMessage} from "element-plus";
import {memberInfoShare} from "../member/MemberInfoShare.js";
import {homeBlogStore} from "../honeBlog/HomeBlogShared.js";


export const followedMembersStore = defineStore('followed', () => {

    const memberStore = memberInfoShare()
    const allFollowedIds = ref([])

    const followedSortField = ref('b.create_time') // 默认排序

    const loading = ref(true)
    const hasMore = ref(true)
    const currentPage = ref(1)

    // 触发刷新
    const followedBlogList = ref([
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

    const form = ref({
        currentPage: 1,
        pageSize: 20,
        followedId: '',
        orderType: ''
    })

    async function fetchFollowedBlogs() {
        if (allFollowedIds.value.length === 0 ) {
            return;
        }
        form.value.currentPage = currentPage.value
        form.value.followedId = allFollowedIds.value
        form.value.orderType = followedSortField.value
        // 请求
        try {
            const response = await mRequest.post("/follow/listFollowed",form.value)
            if (response.data.code === 200) {
                if (response.data.data !== null) {
                    if (currentPage.value === 1) {
                        followedBlogList.value = response.data.data
                    } else {
                        followedBlogList.value = followedBlogList.value.concat(response.data.data)
                    }
                    currentPage.value += 1;
                } else {
                    hasMore.value = false;
                    loading.value = false;
                }
            } else {
                hasMore.value = false;
                loading.value = false;
                ElMessage({
                    type: 'warning',
                    message: response.data.msg
                })
            }
        } catch (error) {
            hasMore.value = false;
            loading.value = false;
            console.log(error.message)
        }
    }

    async function fetchAllFollowedIds() {
        try {
            const response = await mRequest.get("/follow/getFollowedIdsById",{
                params: {
                    followerId: memberStore.memberId
                }
            })
            if (response.data.code === 200) {
                allFollowedIds.value = response.data.data
                if (allFollowedIds.value.length === 0 ) {
                    loading.value = false
                    return;
                }
            } else {
                console.log(response.data.msg)
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    function reset() {
        allFollowedIds.value = []
        followedBlogList.value = []
        followedSortField.value = 'b.create_time'
        currentPage.value = 1;
        loading.value = true
        hasMore.value = true
    }

    // 监听排序字段变化，自动请求数据
    watch(followedSortField, () => {
        fetchFollowedBlogs()
    })

    return {
        allFollowedIds,
        loading,
        followedBlogList,
        followedSortField,
        reset,
        hasMore,
        currentPage,
        fetchFollowedBlogs,
        fetchAllFollowedIds,
    }
})