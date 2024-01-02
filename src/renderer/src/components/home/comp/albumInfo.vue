<template>
  <div class="album-info">
    <div class="album-info-box">
      <img class="pic" :src="album['picUrl']" />
      <div class="info">
        <p class="name">
          <span>专辑</span>
          {{ album['name'] }}
        </p>
        <p class="artist">
          歌手: <span v-for="artist in album['artists']">{{ artist['name'] }}&nbsp;</span>
        </p>
        <p class="time">
          时间: <span>{{ timestampToDate(album['publishTime']) }}</span>
        </p>
      </div>
    </div>
    <div class="song-info-box">
      <n-tabs type="line" animated>
        <n-tab-pane name="song" tab="歌曲列表">
          <div class="song-box">
            <div class="song-item-title">
              <span class="number">&nbsp;</span>
              <span class="choose">&nbsp;</span>
              <span class="title">音乐标题</span>
              <span class="singer">歌手</span>
              <span class="album">专辑</span>
              <span class="duration">时长</span>
            </div>
            <div class="song-item" v-for="(song, index) in songs">
              <span class="number">{{ indexFilter(index) }}</span>
              <span class="choose">
                <n-icon class="icon" size="15">
                  <Download />
                </n-icon>
              </span>
              <span class="title">
                {{ song['name'] }}
                <div class="vip" v-if="song['fee'] === 1">VIP</div>
              </span>
              <span class="singer" :title="singerSummary(song['ar'])">{{ singerSummary(song['ar']) }}</span>
              <span class="album" :title="song['al']['name']">{{ song['al']['name'] }}</span>
              <span class="duration">{{ millisecondsToMinutesAndSeconds(song['dt']) }}</span>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="comment" tab="评论">
          <div class="comment-box">
            当前功能尚在开发中...
          </div>
        </n-tab-pane>
        <n-tab-pane name="desc" tab="专辑详情">
          <div class="desc-box">
            <p class="title">专辑介绍</p>
            <p class="content" v-html="album['description']"></p>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { NTabs, NTabPane, NIcon } from 'naive-ui';
import { Download } from '@vicons/tabler'
import { getAlbum } from '../../../api/netease'
import { useRoute } from "vue-router";
import { timestampToDate, indexFilter, millisecondsToMinutesAndSeconds } from '../../../utils'

const route = useRoute()
const albumParams = ref({
  id: 0
})
const songs = ref([] as any[])
const album = ref({})

onMounted(() => {
  albumParams.value.id = Number(route.query.id as string)
  fetchAlbum()
})
watch(route, (routeNewVal, _) => {
  albumParams.value.id = Number(routeNewVal.query.id as string)
  fetchAlbum()
})

const fetchAlbum = (): void => {
  getAlbum(albumParams.value).then(res => {
    album.value = res.data.album
    songs.value = res.data.songs
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
</script>
<style scoped lang="less">
.album-info {
  overflow-y: auto;
  height: calc(100vh - 160px);
  padding-bottom: 30px;

  .album-info-box {
    width: 100%;
    height: 180px;
    margin-bottom: 30px;

    .pic {
      width: 180px;
      height: 180px;
      background-color: #CCC;
      border-radius: 8px;
      float: left;
    }

    .info {
      float: left;
      margin-left: 30px;

      .name {
        font-size: 24px;
        font-weight: 500;
        color: var(--theme-color);

        span {
          display: block;
          font-weight: normal;
          font-size: 13px;
          color: var(--theme-center-color);
          border: solid 1px var(--theme-center-color);
          width: 35px;
          text-align: center;
          float: left;
          margin-top: 8px;
          border-radius: 3px;
          margin-right: 10px;
        }
      }

      .artist {
        margin-top: 15px;
        font-size: 13px;
        color: var(--theme-color);

        span {
          color: var(--theme-span-height-light);
          cursor: pointer;
        }
      }

      .time {
        margin-top: 3px;
        font-size: 13px;
        color: var(--theme-color);

        span {
          color: var(--theme-desc);
        }
      }
    }
  }

  .song-info-box {
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
  }

  .comment-box {}

  .desc-box {
    .title {
      font-weight: 500;
      color: var(--theme-color);
      margin-top: 5px;
      margin-bottom: 15px;
    }

    .content {
      font-size: 13px;
      color: var(--theme-secondary);
    }
  }
}
</style>