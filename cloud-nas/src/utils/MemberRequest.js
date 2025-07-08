import axios from 'axios';
import {ElMessage} from "element-plus";
import router from '../router/index.js'
import {memberInfoShare} from "../pinia/member/MemberInfoShare.js";


const instance = axios.create({
    baseURL: '/memberapi/', //  API 地址
    timeout: 10000,
});


//添加请求拦截器
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('m_token');
        if (token) {
            config.headers.memberAuthorization = `${token}`;
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
            ElMessage.warning(error.response.data.msg);
            localStorage.clear();
            const memberInfoStore = memberInfoShare()
            memberInfoStore.reset();
            router.push('/phoneLogin') // 跳转登录页
        }
        return Promise.reject(error)
    }
)

export default instance;