// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {useBlogSearchStore} from "./useBlogSearchStore.js";


export const useAllSearchStore = defineStore('useAllSearchStore', () => {

    const searchBlogList = ref([])

    const blogSearchStore = useBlogSearchStore()
    const currentPage = ref(1)
    const pageSize = ref(20)
    const loading = ref(true)
    const hasMore = ref(true)
    const getAllBySearch = async () => {
        try {
            const response = await mRequest.get("blog/searchAllByES",{
                params: {
                    currentPage: currentPage.value,
                    pageSize: pageSize.value,
                    searchValue: blogSearchStore.searchValue,
                }
            })
            if (response.data.code === 200) {
                if (response.data.data !== null) {
                    if (currentPage.value === 1) {
                        searchBlogList.value = response.data.data;
                        if (response.data.data.length < 20) {
                            loading.value = false;
                            hasMore.value = false
                        }
                    } else {
                        searchBlogList.value = searchBlogList.value.concat(response.data.data)
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
        getAllBySearch,
        reset
    }
},{
    persist: true
})