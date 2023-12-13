export default {
  path: '/home',
  component: () => import('../../components/home/Home.vue'),
  children: [{
    path: 'album-info',
    name: 'albumInfo',
    component: () => import('../../components/home/comp/AlbumInfo.vue'),
  }, {
    path: 'play-list',
    name: 'playList',
    component: () => import('../../components/home/comp/PlayListInfo.vue'),
  }, {
    path: 'search-table',
    name: 'searchTable',
    component: () => import('../../components/home/comp/SearchTable.vue'),
  }, {
    path: 'singer-info',
    name: 'singerInfo',
    component: () => import('../../components/home/comp/SingerInfo.vue'),
  }, {
    path: 'singer-table',
    name: 'singerTable',
    component: () => import('../../components/home/comp/SingerTable.vue'),
  }, {
    path: 'song-table',
    name: 'songTable',
    component: () => import('../../components/home/comp/SongTable.vue'),
  }],
}