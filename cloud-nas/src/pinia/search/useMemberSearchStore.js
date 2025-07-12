// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {useBlogSearchStore} from "./useBlogSearchStore.js";


export const useMemberSearchStore = defineStore('useMemberSearchStore', () => {

    const blogSearchStore = useBlogSearchStore()
    const searchMemberList = ref([])

    const currentPage = ref(1)
    const pageSize = ref(20)
    const loading = ref(true)
    const hasMore = ref(true)
    const getMembersBySearch = async () => {
        try {
            const response = await mRequest.get("member/searchByES",{
                params: {
                    currentPage: currentPage.value,
                    pageSize: pageSize.value,
                    searchValue: blogSearchStore.searchValue,
                }
            })
            if (response.data.code === 200) {
                if (response.data.data !== null) {
                    if (currentPage.value === 1) {
                        searchMemberList.value = response.data.data;
                        if (response.data.data.length < 20) {
                            loading.value = false;
                            hasMore.value = false
                        }
                    } else {
                        searchMemberList.value = searchMemberList.value.concat(response.data.data)
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
        searchMemberList.value = [];
        loading.value = true;
        hasMore.value = true;
        currentPage.value = 1;
        blogSearchStore.searchValue = ''
    }



    return {
        searchMemberList,
        hasMore,
        loading,
        currentPage,
        pageSize,
        getMembersBySearch,
        reset
    }
},{
    persist: true
})