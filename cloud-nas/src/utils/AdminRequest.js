import axios from 'axios';
import {ElMessage} from "element-plus";
import router from '../router/index.js'

const instance = axios.create({
    baseURL: '/adminapi/', //  API 地址
    timeout: 10000,
});

//添加请求拦截器
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('a_token');
        if (token) {
            config.headers.adminAuthorization = `${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response && error.response.status === 401) {
            ElMessage.warning('未登录或登录已过期，请重新登录')
            router.push('/login') // 跳转登录页
        }
        return Promise.reject(error)
    }
)

export default instance;