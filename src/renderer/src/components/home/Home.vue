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
          <div class="menu-search-item">
            <n-input round size="small" placeholder="搜索"></n-input>
          </div>
          <div class="switch-theme" @click="switchTheme">切换主题</div>
        </div>
      </div>
      <div class="content-box">
        <div class="person-box">
          <p class="online-title">当前在线：</p>
        </div>
        <div class="song-box">
          <SongTable v-if="menuSelectedIndex == 0"></SongTable>
          <SingerTable v-if="menuSelectedIndex == 1"></SingerTable>
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
import { onMounted, ref } from 'vue';
import { darkTheme, NConfigProvider, NInput, NIcon } from 'naive-ui';
import type { GlobalTheme } from 'naive-ui'
import { ChevronBackOutline, ChevronForwardOutline, PauseCircle, CaretForwardCircle, PlaySkipBack, PlaySkipForward, Shuffle, VolumeLow, VolumeMedium, VolumeOff } from '@vicons/ionicons5'
import SongTable from './comp/SongTable.vue'
import SingerTable from './comp/SingerTable.vue'

// 主题
const theme = ref<GlobalTheme | null>(null)
const currentTheme = ref('light')

// 导航栏
const menuSelectedIndex = ref(0)

onMounted(() => {

})

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
      float: left;
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
</style>
