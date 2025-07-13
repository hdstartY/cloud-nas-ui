// src/stores/blog.js
import {defineStore} from 'pinia'
import {computed, ref, watch} from 'vue'
import mRequest from "../../utils/MemberRequest.js";
import {memberInfoShare} from "./MemberInfoShare.js";
import {debounce} from 'lodash'
import {ElMessage} from "element-plus";

export const memberEditBlogShare = defineStore('memberEditBlog', () => {


    const memberEditBlog = ref(
        {
            id: '',
            createTime: '',
            textContent: '',
            isPublic: '',
            images: [],
        }
    )



    function reset() {

    }


    return {
        memberEditBlog,
        reset
    }
})