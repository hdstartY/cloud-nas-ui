// src/stores/blog.js
import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'

export const drectionStatusStore = defineStore('dereactonStatus', () => {

    const memberBlogDerection = ref(1);

    function reset() {

    }



    return {
        memberBlogDerection,
        reset
    }
},{
    persist: true
})