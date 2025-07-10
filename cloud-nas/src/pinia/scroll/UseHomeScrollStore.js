// store/scrollStore.js - 创建滚动位置存储
import { defineStore } from 'pinia';

export const useHomeScrollStore = defineStore('useHomeScrollStore', {
    state: () => ({
        positions: {} // 存储格式: { routeName: scrollTop }
    }),
    actions: {
        savePosition(routeName, position) {
            this.positions[routeName] = position;
        },
        getPosition(routeName) {
            return this.positions[routeName] || 0;
        }
    }
});