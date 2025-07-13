// store/scrollStore.js - 创建滚动位置存储
import { defineStore } from 'pinia';
import {ref} from "vue";

export const useScrollStore = defineStore('scroll', () =>{
    const positions = ref({})

    function savePosition(routeName, position) {
        this.positions[routeName] = position;
    }

    function getPosition(routeName) {
        return this.positions[routeName] || 0;
    }

    function reset() {

    }

    return {
        positions,
        savePosition,
        getPosition,
        reset,
    }
});