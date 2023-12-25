<template>
  <div class="search-table">
    <div class="title-box">
      <div class="song-info">
        <span class="name">{{ searchSongParams.keywords }}</span>
        <span class="number" v-if="searchSongParams.type === 1">找到{{ dataCount }}首单曲</span>
        <span class="number" v-if="searchSongParams.type === 10">找到{{ dataCount }}张专辑</span>
        <span class="number" v-if="searchSongParams.type === 100">找到{{ dataCount }}位歌手</span>
      </div>
      <div class="select-box">
        <n-tabs type="line" animated :on-update:value="handelUpdateTabs">
          <n-tab-pane name="song" tab="单曲">
            <div ref="songRef" class="song-box">
              <div class="song-item-title">
                <span class="number">&nbsp;</span>
                <span class="choose">&nbsp;</span>
                <span class="title">音乐标题</span>
                <span class="singer">歌手</span>
                <span class="album">专辑</span>
                <span class="duration">时长</span>
              </div>
              <div class="song-item" v-for="(song, index) in songs" @dblclick="handelChooseSong(song)">
                <span class="number">{{ indexFilter(index + searchSongParams.offset) }}</span>
                <span class="choose">
                  <n-icon class="icon" size="15">
                    <Download />
                  </n-icon>
                </span>
                <span class="title">{{ song['name'] }}</span>
                <span class="singer" :title="singerSummary(song['ar'])">{{ singerSummary(song['ar']) }}</span>
                <span class="album" :title="song['al']['name']">{{ song['al']['name'] }}</span>
                <span class="duration">{{ millisecondsToMinutesAndSeconds(song['dt']) }}</span>
              </div>
              <n-pagination style="margin-top: 20px;position: absolute;
            left: 50%;
            transform: translate(-50%, 0);" v-model:page="pageForm.page" :page-count="pageForm.pageCount"
                :on-update:page="handelUpdatePage" />
            </div>
          </n-tab-pane>
          <n-tab-pane name="singer" tab="歌手">
            <div ref="singerRef" class="singer-box">
              <div class="singer-item" v-for="artist in artists">
                <img class="pic" :src="artist['img1v1Url']" />
                <p>
                  <span class="name">{{ artist['name'] }}</span>
                  <span class="eng-name" v-if="artist['alias'].length > 0">({{ artist['alias'][0] }})</span>
                </p>
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane name="album" tab="专辑">
            <div ref="albumRef" class="album-box">
              <div class="album-item" v-for="album in albums">
                <img class="pic" :src="album['blurPicUrl']" />
                <div>{{ album['name'] }}</div>
                <div>
                  <span class="name">{{ album['artist']['name'] }}</span>
                  <span class="eng-name" v-if="album['artist']['alias'].length > 0">({{ album['artist']['alias'][0]
                  }})</span>
                </div>
              </div>
              <n-pagination style="margin-top: 20px;position: absolute;left: 50%;transform: translate(-50%, 0);"
                v-model:page="pageForm.page" :page-count="pageForm.pageCount" :on-update:page="handelUpdatePage" />
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NPagination, NTabs, NTabPane, NIcon } from 'naive-ui';
import { searchSong } from '../../../api/netease'
import { addSong as addSongApi } from '../../../api/song'
import { Download } from '@vicons/tabler'
import { indexFilter, millisecondsToMinutesAndSeconds } from '../../../utils/index'
import { useRoute } from "vue-router";
import { useUserStore } from '../../../store/modules/user'
import { useSocketStore } from '../../../store/modules/webSocket'

const route = useRoute()

const userStore = useUserStore()
const socketStore = useSocketStore()

interface ChooseSongObj {
  // songId: number;
  // name: string;
  // artistId: number;
  // artistName: string;
  // albumId: number;
  // albumName: string;
  // dt: number;
  song: any;
  from: string;
}

const searchSongParams = ref({
  keywords: '', // 搜索关键词
  limit: 100,   // 单页查询数量
  offset: 0,    // 偏移量
  type: 1       // 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音
})
const dataCount = ref(0)
const songs = ref([] as any[])
const artists = ref([] as any[])
const albums = ref([] as any[])

const pageForm = ref({
  page: 1,
  pageCount: 0
})

const songRef = ref({} as Element)
const singerRef = ref({} as Element)
const albumRef = ref({} as Element)

const chooseSongObj = ref({} as ChooseSongObj)

onMounted(() => {
  searchSongParams.value.keywords = route.query.keywords as string
  fetchSong()
})
// 获取歌曲搜索
const fetchSong = (): void => {
  let type = searchSongParams.value.type
  searchSongParams.value.offset = (pageForm.value.page - 1) * searchSongParams.value.limit
  searchSong(searchSongParams.value).then(res => {
    console.log(res)
    if (type === 1) { // 单曲
      dataCount.value = res.data.result.songCount
      songs.value = res.data.result.songs
      pageForm.value.pageCount = Math.ceil(dataCount.value / searchSongParams.value.limit)
    }
    if (type === 10) { // 专辑
      dataCount.value = res.data.result.albumCount
      albums.value = res.data.result.albums
      pageForm.value.pageCount = Math.ceil(dataCount.value / searchSongParams.value.limit)
    }
    if (type === 100) { // 歌手
      dataCount.value = res.data.result.artistCount
      artists.value = res.data.result.artists
    }
  })
}
// 歌手汇总
const singerSummary = (singers: any[]): string => {
  let result = ''
  singers.forEach(item => {
    result += item['name'] + ' '
  })
  return result
}
// 歌曲下一页
const handelUpdatePage = (page: number): void => {
  pageForm.value.page = page
  fetchSong()
  let type = searchSongParams.value.type
  if (type === 1) { // 单曲
    songRef.value.scrollTop = 0
  }
  if (type === 10) { // 专辑
    albumRef.value.scrollTop = 0
  }
  if (type === 100) { // 歌手
    singerRef.value.scrollTop = 0
  }
}

// 分页更新
const handelUpdateTabs = (value: string): void => {
  switch (value) {
    case 'song':
      searchSongParams.value.limit = 100
      searchSongParams.value.type = 1
      break;
    case 'singer':
      searchSongParams.value.type = 100
      break;
    case 'album':
      searchSongParams.value.limit = 20
      searchSongParams.value.type = 10
      break;
    default: break;
  }
  searchSongParams.value.offset = 0
  pageForm.value = {
    page: 1,
    pageCount: 0
  }
  fetchSong()
}

// 添加音乐
const handelChooseSong = (song: any): void => {
  chooseSongObj.value = {
    song: song,
    from: userStore.getUserInfo.nickname
  }
  addSongApi(chooseSongObj.value)
  setTimeout(() => {
    sendMsg('all', 'updateSong')
  }, 500)
}
/**
 * 发送消息
 * @param user 接受人ID
 * @param msg  消息文本
 */
 const sendMsg = (user: string, msg: string): void => {
  socketStore.sendMessage(JSON.stringify({ 'toUser': user, 'toMsg': msg }))
}
</script>
<style scoped lang="less">
.search-table {
  overflow-y: auto;
  height: calc(100vh - 160px);
  padding-bottom: 30px;

  .title-box {
    width: 100%;
    height: 90px;
    position: absolute;
    top: 0;
    background-color: var(--theme-background);

    .song-info {
      margin-top: 10px;

      .name {
        font-size: 22px;
        font-weight: 500;
      }

      .number {
        font-size: 12px;
        margin-left: 5px;
        color: var(--theme-secondary);
      }
    }
  }

  .song-box {
    height: calc(100vh - 300px);
    padding-bottom: 60px;
    position: relative;
    overflow: auto;

    .song-item-title {
      font-size: 13px;
      height: 32px;
      line-height: 32px;
      width: 100%;
      cursor: pointer;

      .number {
        display: block;
        float: left;
        width: 50px;
        text-align: center;
        color: var(--theme-desc);
        font-size: 12px;
      }

      .choose {
        display: block;
        float: left;
        width: 30px;
      }

      .title {
        display: block;
        float: left;
        width: calc(100% - 50px - 30px - 150px - 250px - 70px);
        color: var(--theme-color);
        font-size: 12px;
      }

      .singer {
        display: block;
        float: left;
        color: var(--theme-desc);
        font-size: 12px;
        width: 150px;
      }

      .album {
        display: block;
        float: left;
        color: var(--theme-desc);
        font-size: 12px;
        width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .duration {
        display: block;
        float: left;
        color: var(--theme-desc);
        font-size: 12px;
        width: 70px;
      }
    }

    .song-item {
      font-size: 13px;
      height: 32px;
      line-height: 32px;
      width: 100%;
      cursor: pointer;

      .number {
        display: block;
        float: left;
        width: 50px;
        text-align: center;
        color: var(--theme-desc);
        font-size: 12px;
      }

      .choose {
        display: block;
        float: left;
        width: 30px;

        .icon {
          position: relative;
          top: 2px;
        }
      }

      .title {
        display: block;
        float: left;
        width: calc(100% - 50px - 30px - 150px - 250px - 70px);
        color: var(--theme-color);
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .singer {
        display: block;
        float: left;
        color: var(--theme-desc);
        font-size: 12px;
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .album {
        display: block;
        float: left;
        color: var(--theme-desc);
        font-size: 12px;
        width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .duration {
        display: block;
        float: left;
        color: var(--theme-desc);
        font-size: 12px;
        width: 70px;
      }
    }

    .song-item:nth-child(even) {
      background-color: var(--theme-table-interval);
    }

    .song-item:hover {
      background-color: var(--theme-table-hover);
    }

    .song-item:hover .choose .icon {
      color: var(--theme-center-color);
    }
  }

  .singer-box {
    height: calc(100vh - 300px);
    padding-bottom: 60px;
    position: relative;
    overflow: auto;

    .singer-item {
      width: 100%;
      height: 90px;
      cursor: pointer;

      .pic {
        width: 65px;
        height: 65px;
        background-color: #CCC;
        border-radius: 6px;
        float: left;
        margin: 12px;
      }

      p {
        line-height: 90px;

        .name {
          color: var(--theme-color);
        }

        .eng-name {
          color: var(--theme-desc);
          margin-left: 5px;
        }
      }
    }

    .singer-item:nth-child(even) {
      background-color: var(--theme-table-interval);
    }

    .singer-item:hover {
      background-color: var(--theme-table-hover);
    }
  }

  .album-box {
    height: calc(100vh - 300px);
    padding-bottom: 60px;
    position: relative;
    overflow: auto;

    .album-item {
      width: 100%;
      height: 90px;
      clear: both;
      cursor: pointer;

      .pic {
        width: 65px;
        height: 65px;
        background-color: #CCC;
        border-radius: 6px;
        float: left;
        margin: 12px;
      }

      div {
        line-height: 90px;
        float: left;
        color: var(--theme-color);

        .name {
          font-size: 12px;
          color: var(--theme-desc);
        }

        .eng-name {
          font-size: 12px;
          color: var(--theme-secondary);
          margin-left: 5px;
        }
      }

      div:last-child {
        float: right;
        margin-right: 100px;
        width: 250px;
      }
    }

    .album-item:nth-child(even) {
      background-color: var(--theme-table-interval);
    }

    .album-item:hover {
      background-color: var(--theme-table-hover);
    }
  }
}
</style>