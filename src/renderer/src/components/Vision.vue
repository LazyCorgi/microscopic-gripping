<template>
  <div class="video-container">
    <img v-if="!loadError" :src="videoUrl" class="video-stream" @error="onVideoError" />
    <div v-else class="no-signal">🚫 无信号</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const videoUrl = 'http://your-ip-or-domain/mjpeg-stream'
const loadError = ref(false)

const onVideoError = (): void => {
  loadError.value = true
}
</script>

<style scoped>
.video-container {
  width: 100%;
  height: 100%;
  background-color: black;
  position: relative;
}

.video-stream {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no-signal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  background-color: #f8f8f8;
  font-size: 24px;
}
</style>
