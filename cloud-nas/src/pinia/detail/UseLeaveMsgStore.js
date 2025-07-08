// src/stores/blog.js
import { defineStore } from 'pinia'
import {ref} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {publisherMemberIdShare} from "./PublisherMemberIdShare.js";

export const useLeaveMsgStore = defineStore('useLeaveMsgStore', () => {

    const publisherStore = publisherMemberIdShare()

    const leaveMessageForm = ref([

    ])

    const leaveMsgLoading = ref(true)
    const hasMore = ref(true)
    const currentPage = ref(1)
    const getLeaveMessage = async () => {
        try {
            const response = await mRequest.get("/leave/listLeaveMessage",{
                params: {
                    currentPage: currentPage.value,
                    memberId: publisherStore.publisherId
                }
            })
            if (response.data.code === 200) {
                if (response.data.data.length) {
                    if (currentPage.value === 1) {
                        leaveMessageForm.value = response.data.data
                        if (response.data.data.length < 15) {
                            hasMore.value = false
                            leaveMsgLoading.value = false
                        }
                    } else {
                        leaveMessageForm.value = leaveMessageForm.value.concat(response.data.data)
                    }
                    currentPage.value += 1;
                } else {
                    hasMore.value = false
                    leaveMsgLoading.value = false
                }
            } else {
                console.log(response.data.msg)
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    function reset() {
        leaveMessageForm.value = []
        hasMore.value = true;
        leaveMsgLoading.value = true;
        currentPage.value = 1;
    }



    return {
        getLeaveMessage,
        hasMore,
        leaveMsgLoading,
        leaveMessageForm,
        reset
    }
},{

})