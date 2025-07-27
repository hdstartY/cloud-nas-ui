// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {useHomeSearchStore} from "./useHomeSearchStore.js";
import {ElMessage} from "element-plus";

export const useBlogSearchStore = defineStore('useBlogSearchStore', () => {

    const homeSearchStore = useHomeSearchStore()

    const searchBlogList = ref([])
    const currentPage = ref(1)
    const pageSize = ref(20)
    const loading = ref(true)
    const hasMore = ref(true)
    const getBLogsBySearch = async () => {
        if (!homeSearchStore.homeSearchValue.length) {
            ElMessage({
                type: 'warning',
                message: '搜索内容不能为空！！！'
            })
            loading.value = false;
            hasMore.value = false
            return;
        }
        try {
            const response = await mRequest.get("blog/searchBlogByES",{
                params: {
                    currentPage: currentPage.value,
                    pageSize: pageSize.value,
                    searchValue: homeSearchStore.homeSearchValue,
                }
            })
            if (response.data.code === 200) {
                if (response.data.data !== null) {
                    if (currentPage.value === 1) {
                        searchBlogList.value = response.data.data;
                    } else {
                        searchBlogList.value = searchBlogList.value.concat(response.data.data)
                    }
                    currentPage.value += 1;
                    if (response.data.data.length < 20) {
                        loading.value = false;
                        hasMore.value = false
                    }
                } else {
                    loading.value = false
                    hasMore.value = false
                }
            } else {
                console.log(response.data.msg)
                hasMore.value = false;
                loading.value = false
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    function reset() {
        searchBlogList.value = [];
        loading.value = true;
        hasMore.value = true;
        currentPage.value = 1;
    }



    return {
        searchBlogList,
        hasMore,
        loading,
        currentPage,
        pageSize,
        getBLogsBySearch,
        reset
    }
},{
    persist: true
})