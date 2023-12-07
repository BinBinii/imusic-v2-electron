<template>
  <div>
    <n-config-provider :theme="theme">
      <div class="menu-box">
        <div class="logo">
          <div class="chevron-box">
            <n-icon class="chevron-item" style="margin-right: 10px;" size="18">
              <ChevronBackOutline />
            </n-icon>
            <n-icon class="chevron-item" size="18">
              <ChevronForwardOutline />
            </n-icon>
          </div>
        </div>
        <div class="menu-btn-box menu-btn-box-screen-one">
          <div class="menu-btn-item" :class="menuSelectedIndex == 0 ? 'menu-btn-item-selected' : ''"
            @click="menuSelectedIndex = 0">播放</div>
          <div class="menu-btn-item" :class="menuSelectedIndex == 1 ? 'menu-btn-item-selected' : ''"
            @click="menuSelectedIndex = 1">歌手</div>
          <div class="switch-theme" @click="switchTheme">切换主题</div>
          <div class="menu-search-item">
            <n-input v-model:value="searchForm.keywords" @focus="showSearchModal = true" @blur="handelSearchBlur()" round
              size="small" placeholder="搜索"></n-input>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="person-box">
          <p class="online-title">当前在线：</p>
        </div>
        <div class="song-box">
          <SongTable v-if="menuSelectedIndex == 0"></SongTable>
          <SingerTable v-if="menuSelectedIndex == 1"></SingerTable>
          <SearchTable v-if="menuSelectedIndex == 2"></SearchTable>
          <div class="search-box" v-if="showSearchModal">
            <div class="hot-box" v-if="searchForm.keywords.length == 0">
              <p class="hot-title">热搜榜</p>
              <div class="hot-item" v-for="(item, index) in hotDetail">
                <div class="hot-item-left">{{ index + 1 }}</div>
                <div class="hot-item-right" :style="item['content'] == '' ? 'line-height: 60px' : ''">
                  <p class="search-word" :style="item['content'] !== '' ? 'margin-top: 6px' : ''">{{ item['searchWord']
                  }}<span class="score">{{ item['score'] }}</span></p>
                  <p class="content" v-if="item['content']">{{ item['content'] }}</p>
                </div>
              </div>
            </div>
            <div class="search-content" v-else>
              <p class="more">搜"<span class="span-height-light">{{ searchForm.keywords
              }}</span>"相关的结果 ></p>
              <div class="panel" v-for="order in searchList.order">
                <div class="title">
                  <n-icon size="18" style="position: relative;top: 4px;margin-left: 10px;margin-right: 5px;">
                    <QueueMusicRound v-if="order == 'songs'" />
                    <MusicNoteRound v-if="order == 'playlists'" />
                    <AlbumOutlined v-if="order == 'albums'" />
                    <PersonOutlineRound v-if="order == 'artists'" />
                  </n-icon>
                  <span>{{ orderDictionary[order] }}</span>
                </div>
                <div class="panel-item" v-for="item in searchList[order]" @click="menuSelectedIndex = 2">
                  <span v-html="brightenKeyword(item['name'])"></span>
                  <span v-if="item['artist']"> - <a v-html="brightenKeyword(item['artist']['name'])"></a></span>
                  <span v-if="item['artists']"> -
                    <a v-for="artist in item['artists']"><span v-html="brightenKeyword(artist['name'])"></span>&nbsp;</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="control-box">
        <div class="music-info">
          <div class="music-cover"></div>
          <div class="music-content">
            <p><span class="music-name">沉默是金</span><span class="music-singer"> - 张国荣</span></p>
            <p class="duration">03:45 / 04:32</p>
          </div>
        </div>
        <div class="option-box">
          <n-icon style="position: relative; top: -5px; margin-right: 10px; cursor: pointer;" size="20">
            <PlaySkipBack />
          </n-icon>
          <n-icon style="position: relative; top: 5px; cursor: pointer;" size="40">
            <CaretForwardCircle />
          </n-icon>
          <n-icon style="position: relative; top: -5px; margin-left: 10px; cursor: pointer;" size="20">
            <PlaySkipForward />
          </n-icon>
        </div>
        <div class="volume-box">
          <n-icon style="margin-right: 10px;position: relative;top: 5px;cursor: pointer;" size="20">
            <Shuffle />
          </n-icon>
          <n-icon style="margin-right: 20px;position: relative;top: 5px;cursor: pointer;" size="20">
            <VolumeLow />
          </n-icon>
        </div>
      </div>
    </n-config-provider>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { darkTheme, NConfigProvider, NInput, NIcon } from 'naive-ui';
import type { GlobalTheme } from 'naive-ui'
import { ChevronBackOutline, ChevronForwardOutline, PauseCircle, CaretForwardCircle, PlaySkipBack, PlaySkipForward, Shuffle, VolumeLow, VolumeMedium, VolumeOff } from '@vicons/ionicons5'
import { QueueMusicRound, MusicNoteRound, AlbumOutlined, PersonOutlineRound } from '@vicons/material'
import SongTable from './comp/SongTable.vue'
import SingerTable from './comp/SingerTable.vue'
import SearchTable from './comp/SearchTable.vue';
import { getHotDetail, searchSuggest } from '../../api/netease'
import { debounce } from 'lodash';

// 主题
const theme = ref<GlobalTheme | null>(null)
const currentTheme = ref('light')

// 导航栏
const menuSelectedIndex = ref(0)

// 热搜榜
const hotDetail = ref([])
const showSearchModal = ref(false)
const searchForm = ref({
  keywords: ''
})
const searchList = ref([])
const orderDictionary = ref({
  songs: '单曲',
  artists: '歌手',
  albums: '专辑',
  playlists: '歌单'
})

onMounted(() => {
  fetchHotDetail()
})

watch(searchForm, (newVal, _) => {
  if (newVal.keywords && newVal.keywords !== '' && newVal.keywords !== null) {
    handleSearch(newVal)
  }
}, {
  deep: true,
}
);

/**
 * 切换主题
 */
const switchTheme = (): void => {
  if (currentTheme.value == 'light') {
    currentTheme.value = 'dark'
    window.document.documentElement.setAttribute('theme', currentTheme.value);
    theme.value = darkTheme
  } else {
    currentTheme.value = 'light'
    window.document.documentElement.setAttribute('theme', currentTheme.value);
    theme.value = null
  }
}

/**
 * 获取热搜榜
 */
const fetchHotDetail = (): void => {
  getHotDetail().then(res => {
    hotDetail.value = res.data.data
  })
}

const handelSearchBlur = (): void => {
  menuSelectedIndex.value = 2
  setTimeout(() => {
    showSearchModal.value = false
  }, 100)
}

// 延时搜索
const handleSearch = debounce((value) => {
  searchSuggest(value).then(res => {
    searchList.value = res.data.result
  })
}, 300)

// 搜索高亮
const brightenKeyword = (val): any => {
  let keyword = searchForm.value.keywords
  if (keyword.length > 0) {
    let keywordArr = keyword.split("");
    val = val + "";
    keywordArr.forEach(item => {
      if (val.indexOf(item) !== -1 && item !== "") {
        val = val.replace(
          new RegExp(item, 'g'),
          '<font color="#85B9E6">' + item + "</font>"
        );
      }
    });
  }
  return val
}

</script>
<style scoped lang="less">
.menu-box {
  width: 100%;
  height: 60px;
  border-bottom: solid 1.5px var(--theme-border);
  background-color: var(--theme-nav-background);

  .logo {
    float: left;
    width: 200px;
    height: 100%;
    text-align: center;
    line-height: 60px;

    .chevron-box {
      width: 60px;
      height: 100%;
      float: right;

      .chevron-item {
        margin-top: 20px;
      }
    }
  }

  .menu-btn-box {
    float: left;
    width: calc(100vw - 200px);

    .menu-btn-item {
      float: left;
      width: 80px;
      height: 100%;
      text-align: center;
      line-height: 60px;
      cursor: pointer;
    }

    .menu-btn-item-selected {
      color: var(--theme-center-color);
    }

    .menu-search-item {
      float: right;
      margin-left: 20px;
      width: 200px;
      height: 100%;
      line-height: 60px;
    }
  }

  .switch-theme {
    float: right;
    width: 100px;
    height: 100%;
    text-align: center;
    line-height: 60px;
  }
}

.content-box {
  width: 100%;
  height: calc(100vh - 61.5px - 71.5px);

  .person-box {
    float: left;
    width: 200px;
    height: 100%;
    border-right: solid 1.5px var(--theme-border);
    height: 100%;
    box-sizing: border-box;
    padding: 15px;
    background-color: var(--theme-nav-background);

    .online-title {
      color: var(--theme-desc);
    }
  }

  .song-box {
    height: 100%;
    box-sizing: border-box;
    padding: 15px;
    float: right;
    width: calc(100vw - 201.5px);
    height: 100%;
    position: relative;
    overflow: hidden;

    .search-box {
      position: absolute;
      right: 0;
      top: 0;
      width: 350px;
      height: 100%;
      background-color: var(--theme-search-background);
      box-shadow: -5px 0 10px -5px rgba(0, 0, 0, .1);

      .hot-box {
        width: 100%;
        height: 100%;
        overflow: auto;

        .hot-title {
          font-size: 16px;
          color: var(--theme-desc);
          margin: 20px 0px 10px 20px;
        }

        .hot-item {
          width: 100%;
          height: 60px;
          cursor: pointer;

          .hot-item-left {
            float: left;
            width: 50px;
            height: 60px;
            line-height: 60px;
            text-align: center;
          }

          .hot-item-right {
            float: right;
            width: calc(100% - 50px);
            height: 60px;
            line-height: 22px;

            .search-word {
              font-size: 13px;
              color: var(--theme-color);

              .score {
                font-size: 12px;
                color: var(--theme-secondary);
                margin-left: 15px;
              }
            }

            .content {
              font-size: 12px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: var(--theme-desc);
            }
          }
        }

        .hot-item:hover {
          background-color: var(--theme-search-hover-background);
        }
      }

      .search-content {
        width: 100%;
        height: 100%;
        overflow: auto;

        .more {
          margin: 10px 0px 0px 10px;
          font-size: 12px;
          color: var(--theme-desc);
          cursor: pointer;
        }

        .more:hover {
          color: var(--theme-color);
        }

        .panel {
          .title {
            height: 30px;
            line-height: 30px;
            margin-top: 5px;
            color: var(--theme-desc);
          }

          .panel-item {
            padding-left: 32px;
            padding-right: 10px;
            font-size: 13px;
            height: 30px;
            line-height: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
          }

          .panel-item:hover {
            background-color: var(--theme-search-hover-background);
          }
        }
      }
    }
  }
}

.control-box {
  width: 100%;
  height: 70px;
  background-color: var(--theme-nav-background);
  border-top: solid 1.5px var(--theme-border);
  position: relative;

  .music-info {
    width: 300px;
    height: 50px;
    margin: 10px;
    float: left;

    .music-cover {
      float: left;
      width: 50px;
      height: 50px;
      background-color: #CCC;
      border-radius: 5px;
    }

    .music-content {
      float: left;
      margin-left: 10px;
      margin-top: 4px;

      .music-name {
        color: var(--theme-desc);
      }

      .music-singer {
        color: var(--theme-secondary);
        font-size: 12px;
      }

      .duration {
        color: var(--theme-secondary);
        font-size: 12px;
      }
    }
  }

  .option-box {
    overflow: hidden;
    height: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .volume-box {
    float: right;
    height: 70px;
    line-height: 70px;
  }
}

.span-height-light {
  color: var(--theme-span-height-light);
}
</style>
