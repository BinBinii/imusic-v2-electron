import { ResultEnum } from '@renderer/enums/httpEnum';
import axios from 'axios'

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

//响应拦截
$http.interceptors.response.use(res => {
    const { data } = res;
    const { code, result, message } = data;
    // 接口请求成功，直接返回结果
    if (code === ResultEnum.SUCCESS) {
        return result;
      }
      // 接口请求错误
    let errorMsg = message
    switch(code) {
        case ResultEnum.ERROR:
            break;
        case ResultEnum.TIMEOUT:
            break;
    }
    throw new Error(errorMsg)
}, error => {
    return Promise.reject(error);
})

// 导出封装的axios
export default $http
