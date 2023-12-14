<template>
  <n-message-provider>
    <router-view></router-view>
  </n-message-provider>
</template>

<script setup lang="ts">
window.document.documentElement.setAttribute('theme', 'light');
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
