// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {memberInfoShare} from "../member/MemberInfoShare.js";

export const useFollowStore = defineStore('useFollowStore', () => {

    const memberInfo = memberInfoShare()

    const following = ref([

    ])


    const currentPage = ref(1);
    const pageSize = ref(15);
    const followingLoading = ref(true)
    const followingHasMore = ref(true)
    async function getFollowing () {
        try {
            const response = await mRequest.get("/follow/getFollowingMembers",{
                params: {
                    memberId: memberInfo.memberId,
                    currentPage: currentPage.value,
                    pageSize: pageSize.value,
                }
            })
            if (response.data.code === 200) {
                if (response.data.data !== null) {
                    if (currentPage.value === 1) {
                        following.value = response.data.data
                        if (response.data.data.length < 15) {
                            followingLoading.value = false
                            followingHasMore.value = false
                        }
                    } else {
                        following.value = following.value.concat(response.data.data)
                    }
                    currentPage.value += 1;
                } else {
                    followingLoading.value = false
                    followingHasMore.value = false
                }
            } else {
                followingLoading.value = false
                followingHasMore.value = false
                console.log(response.data.msg)
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    function reset() {
        following.value = []
        currentPage.value = 1;
        followingLoading.value = true;
        followingHasMore.value = true;
    }

    return {
        following,
        followingLoading,
        followingHasMore,
        getFollowing,
        reset
    }
},{
    persist: true
})