import request from '../utils/iMusicRequest'

// 添加歌曲
export function addSong(data) {
  return request({
    url: '/song/add',
    method: 'post',
    data
  });
}

// 获取已点歌曲
export function getChooseSong() {
  return request({
    url: '/song/get/list',
    method: 'get'
  });
}