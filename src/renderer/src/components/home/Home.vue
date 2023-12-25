<template>
  <div>
    <n-config-provider :theme="currentTheme === 'dark' ? darkTheme : null">
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
        <div class="menu-btn-box">
          <div class="menu-btn-item" :class="menuSelectedIndex == 0 ? 'menu-btn-item-selected' : ''" @click="toSongTable">
            播放</div>
          <div class="menu-btn-item" :class="menuSelectedIndex == 1 ? 'menu-btn-item-selected' : ''"
            @click="toSingerTable">歌手</div>
          <div class="switch-theme" @click="switchTheme">
            <div :class="currentTheme">
              <div class="moon-box">
                <div class="moon"></div>
              </div>
              <div class="sun-box">
                <div class="sun"></div>
              </div>
              <div class="sea"></div>
            </div>
          </div>
          <div class="menu-search-item">
            <n-input v-model:value="searchForm.keywords" @focus="showSearchModal = true" @blur="handelSearchBlur()" round
              size="small" placeholder="搜索"></n-input>
          </div>
          <div class="userinfo-box">
            <div class="icon" @click="loginShowModal = true">
              <span v-if="!isLogin">尚未登录</span>
              <span v-else>{{ userStore.getUserInfo.nickname }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="person-box">
          <p class="online-title">当前在线：</p>
          <p v-for="item in userStore.getOnlineUsers">{{ item }}</p>
        </div>
        <div class="song-box">
          <router-view />
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
              <p class="more" @click="toSearchTable">搜"<span class="span-height-light">{{ searchForm.keywords
              }}</span>"相关的结果 ></p>
              <div class="panel" v-for="order in searchList['order']">
                <div class="title">
                  <n-icon size="18" style="position: relative;top: 4px;margin-left: 10px;margin-right: 5px;">
                    <QueueMusicRound v-if="order == 'songs'" />
                    <MusicNoteRound v-if="order == 'playlists'" />
                    <AlbumOutlined v-if="order == 'albums'" />
                    <PersonOutlineRound v-if="order == 'artists'" />
                  </n-icon>
                  <span>{{ orderDictionary[order] }}</span>
                </div>
                <div class="panel-item" v-for="item in searchList[order]"
                  @click="toSearchDetail(order, item['id'], item)">
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
        <div class="music-info"
          v-if="currentSongInfo['id'] && currentSongInfo['id'] !== null && currentSongInfo['id'] !== ''">
          <img class="music-cover" :src="currentSongInfo['al']['picUrl']" />
          <div class="music-content">
            <p><span class="music-name">{{ currentSongInfo['name'] }}</span><span class="music-singer"> - {{
              singerSummary(currentSongInfo['ar']) }}</span></p>
            <p class="duration">{{ currentTime }} / {{ millisecondsToMinutesAndSeconds(currentSongInfo['dt']) }}</p>
          </div>
        </div>
        <div class="music-info" v-else>
          <div class="music-cover"></div>
          <div class="music-content">
            <p><span class="music-name">暂无可播放的音乐</span></p>
            <p class="duration">00:00 / 00:00</p>
          </div>
        </div>
        <div class="option-box">
          <n-icon style="position: relative; top: -5px; margin-right: 10px; cursor: pointer;" size="20">
            <PlaySkipBack />
          </n-icon>
          <n-icon style="position: relative; top: 5px; cursor: pointer;" size="40" @click="handleAudioPlay">
            <CaretForwardCircle v-if="!isPlay" />
            <PauseCircle v-else />
          </n-icon>
          <n-icon style="position: relative; top: -5px; margin-left: 10px; cursor: pointer;" size="20" @click="nextSong">
            <PlaySkipForward />
          </n-icon>
        </div>
        <div class="volume-box">
          <n-icon style="margin-right: 10px;position: relative;top: 5px;cursor: pointer;" size="20"
            @click="handleShuffleSong">
            <Shuffle />
          </n-icon>
          <n-icon style="margin-right: 20px;position: relative;top: 5px;cursor: pointer;" size="20">
            <VolumeLow />
          </n-icon>
        </div>
        <div class="progress-box">
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
      <n-modal v-model:show="loginShowModal" preset="dialog" role="dialog" aria-modal="true" title="Dialog">
        <template #header>
          <div>登录</div>
        </template>
        <div>
          <n-form ref="formRef" :model="loginModel" :rules="loginRules" label-placement="left" label-width="auto">
            <n-form-item label="账号" path="account">
              <n-input v-model:value="loginModel.account" placeholder="账号" />
            </n-form-item>
            <n-form-item label="密码" path="password">
              <n-input v-model:value="loginModel.password" type="password" placeholder="密码" />
            </n-form-item>
          </n-form>
        </div>
        <template #action>
          <n-button type="primary" @click="handleLogin">确定</n-button>
        </template>
      </n-modal>
    </n-config-provider>
    <audio ref="audioRef" :src="currentSongMp3['url']" @timeupdate="updateProgress"></audio>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { darkTheme, NConfigProvider, NInput, NIcon, NModal, NForm, NFormItem, NButton } from 'naive-ui';
import type { GlobalTheme } from 'naive-ui'
// VolumeMedium, VolumeOff
import { ChevronBackOutline, ChevronForwardOutline, CaretForwardCircle, PlaySkipBack, PauseCircle, PlaySkipForward, Shuffle, VolumeLow } from '@vicons/ionicons5'
import { QueueMusicRound, MusicNoteRound, AlbumOutlined, PersonOutlineRound } from '@vicons/material'
import { getHotDetail, searchSuggest, getSongUrl as getSongUrlApi, getSongDetail as getSongDetailApi } from '../../api/netease'
import { nextSong as nextSongApi, addSong as addSongApi, shuffleSong as shuffleSongApi } from '../../api/song'
import { useUserStore } from '../../store/modules/user'
import { useSocketStore } from '../../store/modules/webSocket'
import { useChooseSongStore } from '../../store/modules/chooseSong'
import { debounce } from 'lodash';
import { useRouter } from "vue-router";
import { millisecondsToMinutesAndSeconds } from '../../utils/index'

// 路由
const router = useRouter()

// store
const userStore = useUserStore()
const socketStore = useSocketStore()
const chooseSongStore = useChooseSongStore()

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
const songSearchTimer = ref(0)

// 登录
const userInfo = ref({})
const loginShowModal = ref(false)
const isLogin = ref(true)
const loginModel = ref({
  account: '',
  password: ''
})
const loginRules = ref({
  account: {
    required: true,
    message: '请输入账号',
    trigger: ['input']
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input']
  }
})
// 歌曲
const currentSongInfo = ref({} as any)
const currentSongMp3 = ref({} as any)
const audioRef = ref<HTMLAudioElement>()
const isPlay = ref(false)
const progress = ref(0)
const currentTime = ref('00:00')

onMounted(() => {
  checkAndSwitchTheme()
  router.push('/home/song-table')
  fetchHotDetail()
  userStore.getInfo().then(res => {
    userInfo.value = res
  }).catch(err => {
    console.log(err)
    // loginShowModal.value = true
    // isLogin.value = false
  })
  setTimeout(() => {
    initWebsocket()
  }, 1000)
})

onBeforeUnmount(() => {
  socketStore.disconnect()
})

/**
 * 监听搜索框输入值
 */
watch(searchForm, (newVal, _) => {
  if (newVal.keywords && newVal.keywords !== '' && newVal.keywords !== null) {
    handleSearch(newVal)
  }
}, {
  deep: true,
});
// watch(currentSongInfo, (newVal, _) => {
//   if (newVal) {
//     getSongUrl()
//   }
// })
chooseSongStore.$subscribe((mutation, state) => {
  if (mutation.events['key'] === 'isPlaySong') {
    let song = mutation.events['newValue']['song']
    getSongDetailApi({
      ids: song['id']
    }).then(res => {
      isPlay.value = false
      audioRef.value?.pause()
      audioRef.value!.src = ''
      progress.value = 0
      currentTime.value = '00:00'
      currentSongInfo.value = res.data.songs[0]
      getSongUrl()
    })
  }
  if (state.songList.length == 0) {
    isPlay.value = false
    currentSongInfo.value = {}
    progress.value = 0
    currentTime.value = '00:00'
  }
})

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
const checkAndSwitchTheme = (): void => {
  let currentDate = new Date()

  // 获取当前小时和分钟
  let currentHour = currentDate.getHours();
  let currentMinute = currentDate.getMinutes();

  // 设定截止时间为17:30
  const deadlineHour = 17;
  const deadlineMinute = 30;

  // 比较当前时间与截止时间
  if (currentHour > deadlineHour || (currentHour === deadlineHour && currentMinute >= deadlineMinute)) {
    currentTheme.value = 'dark'
  } else {
    currentTheme.value = 'light'
  }

  window.document.documentElement.setAttribute('theme', currentTheme.value);
}

/**
 * 获取热搜榜
 */
const fetchHotDetail = (): void => {
  getHotDetail().then(res => {
    hotDetail.value = res.data.data
  })
}

/**
 * 搜索框取消焦点
 */
const handelSearchBlur = (): void => {
  songSearchTimer.value = new Date().getTime()
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
      if (val.indexOf(item) !== -1 && item !== "" && item !== " ") {
        val = val.replace(
          new RegExp(item, 'g'),
          '<font color="#85B9E6">' + item + "</font>"
        );
      }
    });
  }
  return val
}

/**
 * 跳转歌曲页
 */
const toSongTable = (): void => {
  menuSelectedIndex.value = 0;
  router.push('/home/song-table')
}

/**
 * 跳转歌手页
 */
const toSingerTable = (): void => {
  menuSelectedIndex.value = 1;
  router.push('/home/singer-table')
}

/**
 * 跳转搜索页
 */
const toSearchTable = (): void => {
  menuSelectedIndex.value = 2;
  router.push({
    path: '/home/search-table',
    query: {
      keywords: searchForm.value.keywords
    }
  })
}

/**
 * 跳转搜索详情
 * @param order songs:单曲 playlists:歌单 albums:专辑 artists:歌手
 * @param id 
 */
const toSearchDetail = (order: string, id: number, item: any): void => {
  menuSelectedIndex.value = 2;
  switch (order) {
    case 'songs':
      handelChooseSong(item)
      break;
    case 'playlists':
      router.push({
        path: '/home/play-list',
        query: {
          id: id
        }
      })
      break;
    case 'albums':
      router.push({
        path: '/home/album-info',
        query: {
          id: id
        }
      })
      break;
    case 'artists':
      router.push({
        path: '/home/singer-info',
        query: {
          id: id
        }
      })
      break;
    default: break;
  }
}

/**
 * 登录
 */
const handleLogin = (): void => {
  userStore.login(loginModel.value).then(res => {
    if (res) {
      userStore.getInfo()
      userInfo.value = userStore.getUserInfo
      router.push('/home/song-table')
    }
  })
}

/**
 * 连接Netty服务器
 */
const initWebsocket = (): void => {
  let url = 'ws://127.0.0.1:8000/netty.io?data=' + userStore.getToken
  socketStore.connect(url)
}

// 歌手汇总
const singerSummary = (singers: any[]): string => {
  let result = ''
  if (singers) {
    singers.forEach(item => {
      result += item['name'] + ' '
    })
  }
  return result
}

// 获取歌曲Mp3 url
const getSongUrl = (): void => {
  getSongUrlApi({
    id: currentSongInfo.value['id']
  }).then(res => {
    currentSongMp3.value = res.data.data[0]
    setTimeout(() => {
      handleAudioPlay()
    }, 1000)
  })
}

// 播放音乐
const handleAudioPlay = (): void => {
  if (!isPlay.value) {
    audioRef.value?.play()
    isPlay.value = true
  } else {
    audioRef.value?.pause()
    isPlay.value = false
  }
}

// 更新进度条
const updateProgress = (): void => {
  const audio = audioRef.value!
  if (audio.currentTime === audio.duration) {
    nextSong()
  }
  progress.value = (audio.currentTime / audio.duration) * 100;
  formattedCurrentTime()
}

// 更新时间进度
const formattedCurrentTime = (): void => {
  const audio = audioRef.value!
  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60);
  currentTime.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 下一首
const nextSong = (): void => {
  nextSongApi()
  setTimeout(() => {
    sendMsg('all', 'nextSong')
  }, 500)
}

// 添加音乐
const handelChooseSong = (song: any): void => {
  getSongDetailApi({
    ids: song['id']
  }).then(res => {
    let chooseSongObj = {
      song: res.data.songs[0],
      from: userStore.getUserInfo.nickname
    }
    addSongApi(chooseSongObj)
    setTimeout(() => {
      sendMsg('all', 'updateSong')
    }, 500)
  })
}

// 歌曲乱序
const handleShuffleSong = (): void => {
  shuffleSongApi().then(res => {
    if (res.data.code === '200') {
      sendMsg('all', 'updateSong')
    }
  })
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

    .userinfo-box {
      float: right;
      width: 40px;
      height: 60px;

      .icon {
        width: 35px;
        height: 35px;
        border-radius: 35px;
        margin-top: 13px;
        background-color: var(--theme-border);
        line-height: 30px;
        text-align: center;
        cursor: pointer;

        span {
          font-size: 6px;
        }
      }
    }
  }

  .switch-theme {
    float: right;
    width: 100px;
    height: 60px;
    position: relative;

    .sun {
      margin: 0;
      padding: 0;
      /* 绝对定位 水平垂直居中 */
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      background: orange;
      border-radius: 50%;
    }

    .moon {
      margin: 0;
      padding: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      /* 计算得出月亮的位置 */
      transform: translate(calc(-50% + -10px), calc(-50% + -14px));
      width: 40px;
      height: 40px;
      /* 通过阴影绘制月亮 */
      box-shadow: 10px 12px 0 rgb(242, 255, 0);
      border-radius: 50%;
    }

    .sea {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35%;
      /* 背景模糊制造大海的感觉 */
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 100;
    }

    .sun,
    .moon,
    .sun-box,
    .moon-box {
      /* 添加动画过渡 */
      transition: all .5s ease-in-out;
    }

    .sun-box,
    .moon-box {
      /* 相对定位 */
      position: relative;
      /* 溢出隐藏 */
      overflow: hidden;
    }

    /* 白天 */
    .light {
      .sun-box {
        height: 60px;
      }

      .moon-box {
        height: 0;
      }
    }

    /* 夜晚 */
    .dark {
      .sun-box {
        height: 0px;
      }

      .moon-box {
        height: 60px;
      }
    }
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

  .progress-box {
    width: 100vw;
    height: 10px;
    position: absolute;
    top: 0;

    .progress-bar {
      width: 100%;
      height: 2px;
      background-color: var(--theme-progress-bar);
      position: relative;
    }

    .progress {
      height: 100%;
      background-color: var(--theme-center-color);
    }
  }
}

.span-height-light {
  color: var(--theme-span-height-light);
}
</style>
