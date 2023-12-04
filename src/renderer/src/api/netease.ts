import request from '../utils/neteaseRequest'


// 歌手分类列表
export function getArtistList() {
  return request({
      url: '/artist/list',
      method: 'get'
  });
}

// 搜索
export function searchSong() {
  return request({
      url: '/cloudsearch',
      method: 'get'
  });
}

// 获取音乐url
export function getSongUrl() {
  return request({
      url: '/song/url',
      method: 'get'
  });
}