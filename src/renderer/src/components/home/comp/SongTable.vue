<template>
  <div class="song-table">
    <div ref="songRef" class="song-box">
      <div class="song-item-title">
        <span class="number">&nbsp;</span>
        <span class="title">音乐标题</span>
        <span class="singer">歌手</span>
        <span class="album">专辑</span>
        <span class="duration">时长</span>
        <span class="choose">来自</span>
      </div>
      <div class="song-item" v-for="(song, index) in chooseSongStore.getSongList">
        <span class="number">{{ indexFilter(index) }}</span>
        <span class="title">{{ song['song']['name'] }}</span>
        <span class="singer" :title="singerSummary(song['song']['ar'])">{{ singerSummary(song['song']['ar']) }}</span>
        <span class="album" :title="song['song']['al']['name']">{{ song['song']['al']['name'] }}</span>
        <span class="duration">{{ millisecondsToMinutesAndSeconds(song['song']['dt']) }}</span>
        <span class="choose">{{ song['from'] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useChooseSongStore } from '../../../store/modules/chooseSong'
import { indexFilter, millisecondsToMinutesAndSeconds } from '../../../utils/index'

const chooseSongStore = useChooseSongStore()

onMounted(() => {
})

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
      width: 80px;
      color: var(--theme-desc);
      font-size: 12px;
    }

    .title {
      display: block;
      float: left;
      width: calc(100% - 50px - 150px - 250px - 70px - 80px);
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
      width: 80px;
      color: var(--theme-desc);
      font-size: 12px;
    }

    .title {
      display: block;
      float: left;
      width: calc(100% - 50px - 150px - 250px - 70px - 80px);
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
</style>