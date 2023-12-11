<template>
  <div class="search-table">
    <div class="title-box">
      <div class="song-info">
        <span class="name">{{ searchSongParams.keywords }}</span>
        <span class="number">找到{{ songCount }}首单曲</span>
      </div>
      <div class="select-box">
        <span :class="titleSelected == 0 ? 'selected' : ''" @click="titleSelected = 0">单曲</span>
        <span :class="titleSelected == 1 ? 'selected' : ''" @click="titleSelected = 1">歌手</span>
        <span :class="titleSelected == 2 ? 'selected' : ''" @click="titleSelected = 2">专辑</span>
      </div>
    </div>
    <div class="song-box">
      <n-table :bordered="false" size="small" striped>
        <thead>
          <tr>
            <th class="number"></th>
            <th class="title">音乐标题</th>
            <th class="singer">歌手</th>
            <th class="album">专辑</th>
            <th class="duration">时长</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(song, index) in songs">
            <td class="number">{{ indexFilter(index + searchSongParams.offset) }}</td>
            <td class="title">{{ song['name'] }}</td>
            <td class="singer">
              <span v-for="item in song['ar']">{{ item['name'] }}&nbsp;</span>
            </td>
            <td class="album">{{ song['al']['name'] }}</td>
            <td class="duration">{{ millisecondsToMinutesAndSeconds(song['dt']) }}</td>
          </tr>
        </tbody>
      </n-table>
      <n-pagination style="margin-top: 20px;position: absolute;
            left: 50%;
            transform: translate(-50%, 0);" v-model:page="pageForm.page" :page-count="pageForm.pageCount"
        :on-update:page="handelUpdatePage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NTable, NPagination } from 'naive-ui';
import { searchSong } from '../../../api/netease'
import { indexFilter, millisecondsToMinutesAndSeconds } from '../../../utils/index'

const props = defineProps(['keywords']);
const titleSelected = ref(0)

const searchSongParams = ref({
  keywords: '', // 搜索关键词
  limit: 100,   // 单页查询数量
  offset: 0,    // 偏移量
  type: 1       // 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音
})
const songCount = ref(0)
const songs = ref([])

const pageForm = ref({
  page: 1,
  pageCount: 200
})

onMounted(() => {
  fetchSong()
})
const fetchSong = (): void => {
  searchSongParams.value.keywords = props.keywords
  searchSongParams.value.offset = (pageForm.value.page - 1) * searchSongParams.value.limit
  searchSong(searchSongParams.value).then(res => {
    songCount.value = res.data.result.songCount
    songs.value = res.data.result.songs
    pageForm.value.pageCount = Math.ceil(songCount.value / searchSongParams.value.limit)
  })
}

const handelUpdatePage = (page: number): void => {
  pageForm.value.page = page
  fetchSong()
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
    border-bottom: solid 1px var(--theme-border);
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

    .select-box {
      margin-top: 19px;

      span {
        display: block;
        float: left;
        margin-right: 35px;
        height: 25px;
        cursor: pointer;
      }

      .selected {
        color: var(--theme-center-color);
        border-bottom: solid 2px var(--theme-center-color);
      }
    }
  }

  .song-box {
    padding-top: 100px;
    padding-bottom: 60px;
    position: relative;

    .number {
      width: 50px;
      text-align: center;
      color: var(--theme-desc);
      font-size: 12px;
    }

    .title {
      color: var(--theme-color);
      font-size: 12px;
    }

    .singer {
      color: var(--theme-desc);
      font-size: 12px;
      width: 150px;
    }

    .album {
      color: var(--theme-desc);
      font-size: 12px;
      width: 250px;
    }

    .duration {
      color: var(--theme-desc);
      font-size: 12px;
      width: 70px;
    }
  }
}

.pagination {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: #CCC;
}
</style>