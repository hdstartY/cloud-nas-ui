// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'

export const publisherMemberIdShare = defineStore('publisher', () => {

    const publisherId = ref(0);
    const avatarUrl = ref('')
    const publisherNickName = ref('')
    const isFollowed = ref(false)


    function reset() {
        publisherId.value = 0;
        avatarUrl.value = '';
        publisherNickName.value = '';
        isFollowed.value = null;
    }



    return {
        publisherId,
        avatarUrl,
        publisherNickName,
        isFollowed,
        reset
    }
})