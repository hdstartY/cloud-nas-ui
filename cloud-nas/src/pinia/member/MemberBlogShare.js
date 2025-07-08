// src/stores/blog.js
import {defineStore} from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {memberInfoShare} from "./MemberInfoShare.js";
import {debounce} from 'lodash'
import {ElMessage} from "element-plus";

export const memberBlogShare = defineStore('memberBlog', () => {

    const memberInfoStore = memberInfoShare()

    const loading = ref(true)

    const memberBlogList = ref([
        // {
        //     id: '',
        //     avatar: '',
        //     nickName: '',
        //     memberId: '',
        //     createTime: '',
        //     textContent: '',
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

    const currentPage = ref(1)
    const pageSize = ref(20)
    const hasMore = ref(true)
    async function fetchMemberBlogList () {
        try {
            const response = await mRequest.get("/blog/getBlogsByMemberId",{
                params: {
                    memberId: memberInfoStore.memberId,
                    currentPage: currentPage.value,
                    pageSize: pageSize.value
                }
            })
            if (response.data.code === 200) {
                if (response.data.data !== null) {
                    if (currentPage.value === 1) {
                        memberBlogList.value = response.data.data;
                    } else {
                        memberBlogList.value = memberBlogList.value.concat(response.data.data)
                    }
                    currentPage.value += 1;
                } else {
                    hasMore.value = false;
                    loading.value = false
                }
            } else {
                ElMessage({
                    type: 'warning',
                    message: response.data.msg
                })
            }
        } catch (error) {
            console.log(error.message)
        }
    }


    function reset() {
        memberBlogList.value = []
        loading.value = true;
        currentPage.value = 1;
        hasMore.value = true;
        currentPage.value = 1
    }


    return {
        memberBlogList,
        loading,
        hasMore,
        reset,
        fetchMemberBlogList,
    }
})