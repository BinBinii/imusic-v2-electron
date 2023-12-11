<template>
  <div class="singer-table">
    <template v-if="!isShowInfo">
      <div class="singer-area-box">
        <div class="title">语种：</div>
        <div class="item" v-for="item in areaSelectList" @click="selectArea(item.value)">
          <span :class="item.value == artistRequest.area ? 'selectedItem' : ''">{{ item.label }}</span>
        </div>
      </div>
      <div class="singer-type-box">
        <div class="title">分类：</div>
        <div class="item" v-for="item in typeSelectList" @click="selectType(item.value)">
          <span :class="item.value == artistRequest.type ? 'selectedItem' : ''">{{ item.label }}</span>
        </div>
      </div>
      <div class="singer-screen-box">
        <div class="title">筛选：</div>
        <div style="float: right;width: calc(100% - 42px);">
          <div class="item" v-for="item in screenSelectList" @click="selectScreen(item.value)">
            <span :class="item.value == artistRequest.initial ? 'selectedItem' : ''">{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="singer-box" ref="singerRef" @scroll="handleScroll">
        <n-grid :x-gap="24" :y-gap="24" cols="3 550:4 700:5">
          <n-grid-item v-for="item in artists">
            <div class="singer-item" @click="showSingerInfo(item.id)">
              <img class="pic" :src="item.img1v1Url" />
              <div class="name">{{ item.name }}</div>
            </div>
          </n-grid-item>
        </n-grid>
        <div class="loading" v-if="isLoading">加载中...</div>
      </div>
    </template>
    <template v-else>
      <singer-info :singer-id="isShowSingerId"></singer-info>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NGrid, NGridItem } from 'naive-ui';
import { getArtistList } from '../../../api/netease';
import SingerInfo from './SingerInfo.vue';

// 歌手过滤项
const areaSelectList = ref([
  { label: '全部', value: -1 },
  { label: '华语', value: 7 },
  { label: '欧美', value: 96 },
  { label: '日本', value: 8 },
  { label: '韩国', value: 16 },
  { label: '其他', value: 0 }
])
const typeSelectList = ref([
  { label: '全部', value: -1 },
  { label: '男歌手', value: 1 },
  { label: '女歌手', value: 2 },
  { label: '乐队组合', value: 3 }
])
const screenSelectList = ref([
  { label: '热门', value: '' },
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
  { label: 'D', value: 'd' },
  { label: 'E', value: 'e' },
  { label: 'F', value: 'f' },
  { label: 'G', value: 'g' },
  { label: 'H', value: 'h' },
  { label: 'I', value: 'i' },
  { label: 'J', value: 'j' },
  { label: 'K', value: 'k' },
  { label: 'L', value: 'l' },
  { label: 'M', value: 'm' },
  { label: 'N', value: 'n' },
  { label: 'O', value: 'o' },
  { label: 'P', value: 'p' },
  { label: 'Q', value: 'q' },
  { label: 'R', value: 'r' },
  { label: 'S', value: 's' },
  { label: 'T', value: 't' },
  { label: 'U', value: 'u' },
  { label: 'V', value: 'v' },
  { label: 'W', value: 'w' },
  { label: 'S', value: 's' },
  { label: 'Y', value: 'y' },
  { label: 'Z', value: 'z' }
])

// 歌手列表
interface Artists {
  albumSize: number,
  alias: Array<string>,
  briefDesc: string,
  fansCount: number,
  followed: boolean,
  id: number,
  img1v1Id: number,
  img1v1Id_str: string,
  img1v1Url: string,
  musicSize: number,
  name: string,
  picId: number,
  picId_str: string,
  picUrl: string,
  topicPerson: number,
  trans: string
}
const artists = ref([] as Artists[])
const artistRequest = ref({
  type: -1,
  area: -1,
  limit: 30,
  offset: 0,
  initial: ''
})
const singerRef = ref({} as Element)
const isLoading = ref(false);

const isShowInfo = ref(false)
const isShowSingerId = ref(-1)

onMounted(() => {
  fetchArtistList()
})

/**
 * 语种过滤
 * @param areaValue 
 */
const selectArea = (areaValue: number): void => {
  artistRequest.value.area = areaValue
  artistRequest.value.offset = 0
  fetchArtistList()
}

/**
 * 分类过滤
 * @param typeValue 
 */
const selectType = (typeValue: number): void => {
  artistRequest.value.type = typeValue
  artistRequest.value.offset = 0
  fetchArtistList()
}

/**
 * 首字母筛选过滤
 * @param screenValue 
 */
const selectScreen = (screenValue: string): void => {
  artistRequest.value.initial = screenValue
  artistRequest.value.offset = 0
  fetchArtistList()
}

/**
 * 获取歌手
 */
const fetchArtistList = (): void => {
  getArtistList(artistRequest.value).then(res => {
    artists.value = res.data.artists
  })
}

/**
 * 滚动到底部加载更多
 */
const handleScroll = () => {
  const container = singerRef.value
  if (container.scrollHeight - container.scrollTop === container.clientHeight) {
    loadMore();
  }
}
const loadMore = async () => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  // 增加页数
  artistRequest.value.offset = artistRequest.value.offset + artistRequest.value.limit;
  try {
    await getArtistList(artistRequest.value).then(res => {
      if (res.data.code == 200) {
        let newData = res.data.artists
        // 更新数据
        artists.value = [...artists.value, ...newData];

      }
    })
  } finally {
    // 加载完成后，设置加载状态为 false
    isLoading.value = false;
  }
}

/**
 * 展示歌手详情信息
 * @param id 
 */
const showSingerInfo = (id: number): void => {
  isShowSingerId.value = id
  isShowInfo.value = true
}

</script>
<style scoped lang="less">
.title {
  color: var(--theme-desc);
  float: left;
  clear: both;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
}

.item {
  color: var(--theme-secondary);
  width: 80px;
  height: 30px;
  float: left;
  font-size: 12px;
  text-align: center;

  span {
    display: inline-block;
    padding: 3px 5px;
    margin-top: 2px;
    cursor: pointer;
    border-radius: 5px;
  }

  span:hover {
    color: var(--theme-desc);
  }

  .selectedItem:hover {
    color: var(--theme-center-color);
  }

  .selectedItem {
    color: var(--theme-center-color);
    background-color: var(--thme-span-background-color);
  }
}

.singer-area-box {
  height: 30px;
}

.singer-type-box {
  height: 30px;
}

.singer-screen-box {
  height: 80px;
  margin-bottom: 30px;

  .item {
    color: var(--theme-secondary);
    width: 70px;
    height: 30px;
    float: left;
    font-size: 12px;
    text-align: center;

    span {
      display: inline-block;
      padding: 3px 10px;
      margin-top: 2px;
      cursor: pointer;
    }
  }
}

.singer-box {
  height: calc(100vh - 330px);
  overflow-y: auto;

  .singer-item {
    height: 200px;

    .pic {
      width: 100%;
      border-radius: 6px;
    }

    .name {
      color: var(--theme-desc);
    }
  }

  .loading {
    text-align: center;
    color: var(--theme-secondary);
  }
}
</style>