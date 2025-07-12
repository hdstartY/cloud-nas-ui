// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";


export const useBlogSearchStore = defineStore('useBlogSearchStore', () => {

    const searchBlogList = ref([])

    const searchValue = ref('');
    const currentPage = ref(1)
    const pageSize = ref(20)
    const loading = ref(true)
    const hasMore = ref(true)
    const getBLogsBySearch = async () => {
        try {
            const response = await mRequest.get("blog/searchByES",{
                params: {
                    currentPage: currentPage.value,
                    pageSize: pageSize.value,
                    searchValue: searchValue.value,
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
        searchValue.value = ''
    }



    return {
        searchBlogList,
        hasMore,
        loading,
        currentPage,
        pageSize,
        searchValue,
        getBLogsBySearch,
        reset
    }
},{
    persist: true
})