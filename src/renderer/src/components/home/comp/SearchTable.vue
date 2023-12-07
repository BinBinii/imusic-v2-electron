<template>
  <div class="search-table">
    <div class="title-box">
      <div class="song-info">
        <span class="name">歌曲名称</span>
        <span class="number">找到300首单曲</span>
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
          <tr>
            <td class="number">1</td>
            <td class="title">沉默是金</td>
            <td class="singer">张国荣</td>
            <td class="album">...</td>
            <td class="duration">04:32</td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NTable } from 'naive-ui';

const titleSelected = ref(0)

onMounted(() => {

})

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
    .number {
      width: 50px;
      text-align: center;
      color: var(--theme-desc);
      font-size: 12px;
    }

    .title {
      color: var(--theme-desc);
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
</style>