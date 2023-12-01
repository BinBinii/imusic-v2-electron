<template>
  <div>
    <n-config-provider :theme="theme">
      <div class="menu-box">
        <div class="logo"></div>
        <div class="menu-btn-box">
          <div class="menu-btn-item">播放</div>
          <div class="menu-btn-item">搜索</div>
        </div>
        <div class="switch-theme" @click="switchTheme">切换主题</div>
      </div>
      <div class="content-box">
        <div class="person-box">
          <p class="online-title">当前在线：</p>
        </div>
        <div class="song-box">
          <n-table :bordered="false" size="small" striped>
            <thead>
              <tr>
                <th></th>
                <th>音乐标题</th>
                <th>歌手</th>
                <th>专辑</th>
                <th>时长</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>沉默是金</td>
                <td>张国荣</td>
                <td>...</td>
                <td>04:32</td>
              </tr>
            </tbody>
          </n-table>
        </div>
      </div>
      <div class="control-box">
        <div></div>
      </div>
    </n-config-provider>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NTable, darkTheme, NConfigProvider } from 'naive-ui';
import type { GlobalTheme } from 'naive-ui'

const theme = ref<GlobalTheme | null>(null)
const currentTheme = ref('light')

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

  .menu-btn-box {
    float: left;

    .menu-btn-item {
      float: left;
      width: 80px;
      height: 100%;
      text-align: center;
      line-height: 60px;
      cursor: pointer;
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
  height: calc(100vh - 61.5px - 81.5px);

  .person-box {
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
  }
}

.control-box {
  width: 100%;
  height: 80px;
  background-color: var(--theme-nav-background);
  border-top: solid 1.5px var(--theme-border);
}

@media (min-width: 750px) {
  .logo {
    float: left;
    width: 200px;
    height: 100%;
    text-align: center;
    line-height: 60px;
  }

  .person-box {
    float: left;
    width: 200px;
    height: 100%;
    border-right: solid 1.5px var(--theme-border);
  }

  .song-box {
    float: right;
    width: calc(100vw - 201.5px);
    height: 100%;
  }
}

@media (max-width: 750px) {
  .logo {
    display: none;
  }

  .person-box {
    display: none;
  }

  .song-box {
    width: 100vw;
  }
}
</style>
