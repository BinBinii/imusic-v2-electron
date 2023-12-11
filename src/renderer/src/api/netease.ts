import request from '../utils/neteaseRequest'

// 获取热搜列表
export function getHotDetail() {
  return request({
    url: '/search/hot/detail',
    method: 'get'
  });
}

// 搜索建议
export function searchSuggest(data) {
  return request({
    url: '/search/suggest',
    method: 'get',
    params: data
  })
}

// 歌手分类列表
export function getArtistList(data) {
  return request({
    url: '/artist/list',
    method: 'get',
    params: data
  });
}

// 获取歌手单曲
export function getArtists(data) {
  return request({
    url: '/artists',
    method: 'get',
    params: data
  });
}


// 获取歌手全部歌曲
export function getArtistSongs(data) {
  return request({
    url: '/artist/songs',
    method: 'get',
    params: data
  });
}

// 获取歌手专辑
export function getArtistAlbum(data) {
  return request({
    url: '/artist/album',
    method: 'get',
    params: data
  });
}

// 获取专辑内容
export function getAlbum(data) {
  return request({
    url: '/album',
    method: 'get',
    params: data
  })
}

// 搜索
export function searchSong(data) {
  return request({
    url: '/cloudsearch',
    method: 'get',
    params: data
  });
}

// 获取音乐url
export function getSongUrl(data) {
  return request({
    url: '/song/url',
    method: 'get',
    params: data
  });
}