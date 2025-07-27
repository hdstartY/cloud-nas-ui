import { defineStore } from 'pinia'
import {computed, ref, watch} from 'vue'

export const useHomeSearchStore = defineStore('useHomeSearchStore', () => {

    const homeSearchValue = ref('');

    function reset() {
        homeSearchValue.value = ''
    }



    return {
        homeSearchValue,
        reset
    }
},{
    persist: true
})