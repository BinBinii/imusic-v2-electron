import { ResultEnum } from '@renderer/enums/httpEnum';
import axios from 'axios'
import { useUserStore } from '../store/modules/user'



// 创建axios
const $http = axios.create({
    //设置默认请求地址
    // baseURL: 'http://127.0.0.1/music',
    baseURL: '/music',
    //设置请求超时时间
    timeout: 5000,
    //设置请求头
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

// 请求拦截器
$http.interceptors.request.use(config => {
    const userStore = useUserStore()
    const token = 'Bearer ' + userStore.getToken;
    config.headers.Authorization = token
    return config
}, error => {
    return Promise.reject(error);
})

//响应拦截
$http.interceptors.response.use(res => {
    const { data } = res;
    const { code, message } = data;
    // 接口请求成功，直接返回结果
    if (code === ResultEnum.SUCCESS) {
        return res;
    }
    // if (code === ResultEnum.LOGIN_EXPIRED) {

    // }
    // 接口请求错误
    let errorMsg = message
    switch (code) {
        case ResultEnum.ERROR:
            break;
        case ResultEnum.TIMEOUT:
            break;
    }
    throw new Error(errorMsg)
}, error => {
    return Promise.reject(error);
})

// function refreshToken() {
//     const refreshToken = userStore.getRefreshToken;
//     userStore.setToken(refreshToken)
//     return $http.request({
//         url: '/auth/refresh',
//         method: 'post'
//     })
// }

// 导出封装的axios
export default $http
