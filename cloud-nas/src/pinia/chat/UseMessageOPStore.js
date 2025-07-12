// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {memberInfoShare} from "../member/MemberInfoShare.js";

export const useMessageOPStore = defineStore('useMessageOPStore', () => {

    const memberInfoStore = memberInfoShare()

    const pointMessageForm = ref([]);

    const loading = ref(true)

    const getPointMessages = async () => {
        loading.value = true;
        newsNums.value = 0
        try {
            const response = await mRequest.get("/pointMessage/getNotRedMessages",{
                params: {
                    memberId: memberInfoStore.memberId
                }
            })
            if (response.data.code === 200) {
                pointMessageForm.value = response.data.data
                loading.value = false
                getNewsNum();
            } else {
                loading.value = false
                console.log(response.data.msg)
            }
        } catch (e) {
            loading.value = false
            console.log(e.message)
        }
    }

    const newsNums = ref(0)
    const getNewsNum = () => {
        pointMessageForm.value.forEach(item => {
            newsNums.value += item.newsNum;
        })
    }

    function reset() {
        pointMessageForm.value = []
        newsNums.value = 0;
    }



    return {
        pointMessageForm,
        getPointMessages,
        newsNums,
        loading,
        reset
    }
},{
    persist: true
})