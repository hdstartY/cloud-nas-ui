// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {memberInfoShare} from "./MemberInfoShare.js";
import { debounce } from 'lodash'

export const recoverShare = defineStore('recover', () => {

    const memberInfoStore = memberInfoShare()

    const sortByTime = ref(true)
    const selectedRange = ref('7')

    const recoverBlogList = ref([
        {
            id: '',
            avatar: '',
            nickName: '',
            textContent: '',
            createTime: '',
            images: [],
        }
    ])

    async function fetchRecoverBlogList () {
        try {
            const response = await mRequest.get("/blog/listRecoverBlogs",{
                params: {
                    memberId: memberInfoStore.memberId,
                    timeOrderType: sortByTime.value ? "desc" : "asc",
                    interval: selectedRange.value
                }
            })
            if (response.data.code === 200) {
                recoverBlogList.value = response.data.data
            } else {
                console.log(response.data.msg)
            }
        } catch (e) {
            console.log(e.message)
        }

    }

    const fetchDebounced = debounce(fetchRecoverBlogList, 500)

    watch([sortByTime,selectedRange],() => {
        fetchDebounced()
    })


    function reset() {

    }



    return {
        sortByTime,
        selectedRange,
        recoverBlogList,
        reset,
        fetchRecoverBlogList
    }
})