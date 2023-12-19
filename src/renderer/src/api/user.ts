import request from '../utils/iMusicRequest'

// 登录
export function login(data) {
  return request({
    url: '/auth/authenticate',
    method: 'post',
    data
  });
}

// 注册
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export function userInfo(data) {
  return request({
    url: '/auth/userInfo',
    method: 'get',
    params: data
  })
}

// 获取当前在线用户
export function getOnlineUser() {
  return request({
    url: '/auth/get/online',
    method: 'get'
  })
}