<template>
  <div class="singer-info" ref="songRef" @scroll="handleScroll">
    <div class="desc-box">
      <div class="singer-img"></div>
      <div class="singer-desc">
        <p class="name"><b>{{ artistInfo.name }}</b></p>
        <p class="eng-name">
          <span v-for="(aliasItem, index) in artistInfo.alias">
            <a v-if="index != 0">; </a>{{ aliasItem }}
          </span>
        </p>
        <p class="music-size">
          <span>
            <a>单曲数:</a>{{ artistInfo.musicSize }}
          </span>
          <span>
            <a>专辑数:</a>{{ artistInfo.albumSize }}
          </span>
          <span>
            <a>MV数:</a>{{ artistInfo.mvSize }}
          </span>
        </p>
      </div>
    </div>
    <div class="song-box">
      <n-tabs type="line" animated>
        <n-tab-pane name="album" tab="专辑">
          <div class="albumn-item">
            <div class="albumn-cover">
              <div class="pic"></div>
            </div>
            <div class="songs-box">
              <div class="title">热门50首</div>
              <div class="music-box" v-if="hotSongs.list.length > 0">
                <template v-for="(item, index) in hotSongs.list">
                  <div class="music-item" :class="index % 2 == 0 ? 'music-item-interval' : ''"
                    v-if="index < hotSongs.num" @dblclick="handelChooseSong(item)">
                    <span class="index">{{ indexFilter(index) }}</span>
                    <span class="choose">
                      <n-icon class="icon" size="15">
                        <Download />
                      </n-icon>
                    </span>
                    <span class="name">
                      {{ item.name }}
                      <div class="vip" v-if="item.fee === 1">VIP</div>
                      <text v-if="item.alia[0]">({{ item.alia[0] }})</text>
                    </span>
                    <span class="dt">{{ millisecondsToMinutesAndSeconds(item.dt) }}</span>
                  </div>
                </template>
                <div class="more" @click="hotSongs.num = hotSongs.list.length"
                  v-if="hotSongs.num !== hotSongs.list.length">查看全部50首 ></div>
              </div>
            </div>
          </div>
          <template v-for="album in albumList">
            <div class="albumn-item">
              <div class="albumn-cover">
                <img class="pic" :src="album.picUrl" />
                <p class="publish-time">{{ timestampToDate(album.publishTime) }}</p>
              </div>
              <div class="songs-box">
                <div class="title">{{ album.name }}</div>
                <div class="music-box" v-if="album.songs.length > 0">
                  <template v-for="(item, index) in album.songs">
                    <div class="music-item" :class="index % 2 == 0 ? 'music-item-interval' : ''" v-if="index < album.num" @dblclick="handelChooseSong(item)">
                      <span class="index">{{ indexFilter(index) }}</span>
                      <span class="choose">
                        <n-icon class="icon" size="15">
                          <Download />
                        </n-icon>
                      </span>
                      <span class="name">
                        {{ item.name }}
                        <div class="vip" v-if="item.fee === 1">VIP</div>
                        <text v-if="item.alia[0]">({{ item.alia[0] }})</text>
                      </span>
                      <span class="dt">{{ millisecondsToMinutesAndSeconds(item.dt) }}</span>
                    </div>
                  </template>
                  <div class="more" @click="album.num = album.songs.length" v-if="album.songs.length > album.num">查看全部 >
                  </div>
                  <!-- <div class="more" @click="album.num = album.songs.length">查看全部 >
                  </div> -->
                </div>
              </div>
            </div>
          </template>
          <div class="loading" v-if="isLoading">加载中...</div>
        </n-tab-pane>
        <n-tab-pane name="mv" tab="MV">

        </n-tab-pane>
        <n-tab-pane name="detail" tab="歌手详情">
          <div class="detail-box">
            <p class="title">{{ artistInfo['name'] }}简介</p>
            <p class="desc">{{ artistInfo['briefDesc'] }}</p>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getArtists, getArtistAlbum, getAlbum } from '../../../api/netease';
import { addSong as addSongApi } from '../../../api/song';
import { NTabs, NTabPane, NIcon } from 'naive-ui';
import { Download } from '@vicons/tabler'
import { indexFilter, millisecondsToMinutesAndSeconds, timestampToDate } from '../../../utils/index'
import { useRoute } from "vue-router";
import { useUserStore } from '../../../store/modules/user';
import { useSocketStore } from '../../../store/modules/webSocket';

const route = useRoute()

const userStore = useUserStore()
const socketStore = useSocketStore()

interface ChooseSongObj {
  song: any;
  from: string;
}

// 歌手信息
const artistInfo = ref({} as any)
const hotSongs = ref({
  num: 10,
  list: [] as any[]
})

// 专辑信息
const albumList = ref([] as any[])
const albumParams = ref({
  id: 0,
  limit: 15,
  offset: 0
})

// 加载
const songRef = ref({} as Element)
const isLoading = ref(false);

const chooseSongObj = ref({} as ChooseSongObj)

onMounted(() => {
  albumParams.value.id = Number(route.query.id as string)
  fetchArtists(albumParams.value.id)
  fetchArtistAlbum()
})

watch(route, (routeNewVal, _) => {
  albumParams.value.id = Number(routeNewVal.query.id as string)
  fetchArtists(albumParams.value.id)
  fetchArtistAlbum()
})

// 获取歌手单曲
const fetchArtists = (singerId: number): void => {
  let params = {
    id: singerId
  }
  getArtists(params).then(res => {
    artistInfo.value = res.data.artist
    hotSongs.value.num = 10
    hotSongs.value.list = res.data.hotSongs
  })
}

// 获取歌手专辑
const fetchArtistAlbum = (): void => {
  getArtistAlbum(albumParams.value).then(res => {
    albumList.value = res.data.hotAlbums
    albumList.value.forEach(album => {
      album.num = 10
      getAlbum({
        id: album.id
      }).then(res => {
        album.songs = res.data.songs
      })
    });
  })
}

/**
 * 滚动到底部加载更多
 */
const handleScroll = () => {
  const container = songRef.value
  if (Math.floor(container.scrollHeight - container.scrollTop) === container.clientHeight || Math.ceil(container.scrollHeight - container.scrollTop) === container.clientHeight) {
    loadMore();
  }
}
const loadMore = async () => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  // 增加页数
  albumParams.value.offset = albumParams.value.offset + albumParams.value.limit;
  try {
    await getArtistAlbum(albumParams.value).then(res => {
      let newData = res.data.hotAlbums
      newData.forEach(album => {
        album.num = 10
        getAlbum({
          id: album.id
        }).then(res => {
          album.songs = res.data.songs
        })
      });
      setTimeout(() => {
        // 更新数据
        albumList.value = [...albumList.value, ...newData];
      }, 1000)
    })
  } finally {
    // 加载完成后，设置加载状态为 false
    isLoading.value = false;
  }
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
.singer-info {
  overflow-y: auto;
  height: calc(100vh - 160px);
  padding-bottom: 30px;
}

.desc-box {
  width: 100%;
  height: 200px;

  .singer-img {
    width: 200px;
    height: 200px;
    background-color: #333;
    border-radius: 8px;
    float: left;
  }

  .singer-desc {
    float: left;
    margin-left: 30px;

    .name {
      color: var(--theme-color);
      font-size: 22px;
    }

    .eng-name {
      color: var(--theme-desc);
      font-size: 12px;
    }

    .music-size {
      font-size: 12px;
      margin-top: 20px;

      span {
        color: var(--theme-desc);
        margin-right: 15px;
      }

      a {
        color: var(--theme-color);
      }
    }
  }
}

.song-box {
  width: 100%;
  margin-top: 15px;

  .albumn-item {
    width: 100%;
    overflow: hidden;
    margin-bottom: 80px;

    .albumn-cover {
      float: left;
      width: 215px;

      .pic {
        width: 160px;
        height: 160px;
        border-radius: 8px;
        background-color: #333;
      }

      .publish-time {
        font-size: 12px;
        color: var(--theme-secondary);
      }
    }

    .songs-box {
      float: right;
      width: calc(100% - 215px);
      overflow: hidden;

      .title {
        height: 40px;
        font-size: 16px;
        color: var(--theme-color);
      }

      .music-box {
        width: 100%;
        overflow: hidden;

        .music-item {
          font-size: 13px;
          height: 32px;
          line-height: 32px;
          width: 100%;
          cursor: pointer;

          .index {
            display: block;
            float: left;
            width: 35px;
            text-align: center;
            color: var(--theme-secondary);
          }

          .choose {
            display: block;
            float: left;
            width: 40px;
            text-align: center;

            .icon {
              position: relative;
              top: 2px;
            }
          }

          .name {
            display: block;
            float: left;
            padding-left: 10px;
            width: calc(100% - 35px - 40px - 70px - 10px);
            color: var(--theme-color);

            .vip {
              float: right;
              font-size: 9px;
              height: 14px;
              line-height: 14px;
              padding: 0px 3.5px;
              border-radius: 3px;
              margin-top: 9px;
              margin-right: 9px;
              background-color: #d01a26;
              color: #FFF;
            }

            text {
              color: var(--theme-secondary);
              margin-left: 10px;
            }
          }

          .dt {
            display: block;
            float: right;
            width: 70px;
            color: var(--theme-secondary);
          }
        }

        .music-item:hover {
          background-color: var(--theme-table-hover);
        }

        .music-item:hover .choose .icon {
          color: var(--theme-center-color);
        }

        .music-item-interval {
          background-color: var(--theme-table-interval);
        }

        .more {
          float: right;
          margin-right: 35px;
          margin-top: 10px;
          color: var(--theme-desc);
          font-size: 12px;
          cursor: pointer;
        }

        .more:hover {
          color: var(--theme-color);
        }
      }
    }
  }

  .detail-box {
    .title {
      font-weight: 500;
      color: var(--theme-color);
      margin-top: 5px;
      margin-bottom: 15px;
    }

    .desc {
      font-size: 13px;
      color: var(--theme-secondary);
    }
  }

  .loading {
    text-align: center;
    color: var(--theme-secondary);
  }
}
</style>