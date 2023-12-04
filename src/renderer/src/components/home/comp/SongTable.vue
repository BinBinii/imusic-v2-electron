<template>
  <div class="song-table">
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
</template>

<script setup lang="ts">
import { NTable } from 'naive-ui';
</script>
<style scoped lang="less">
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
</style>