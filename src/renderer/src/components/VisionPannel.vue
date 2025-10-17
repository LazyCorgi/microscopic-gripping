<template>
  <div class="video-container">
    <img v-if="!loadError" :src="computedUrl" class="video-stream" @error="onVideoError" @load="onVideoLoad" />
    <div v-else class="no-signal">🚫 无信号</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const baseUrl = 'http://127.0.0.1:8080/video' // 你的 MJPEG 服务
const loadError = ref(false)
let retryTimer: ReturnType<typeof setInterval> | null = null
let refreshTimer: ReturnType<typeof setInterval> | null = null

const computedUrl = computed(() => `${baseUrl}?t=${Date.now()}`)

const reloadVideo = (): void => {
  loadError.value = false
}

const onVideoError = (): void => {
  loadError.value = true
  if (!retryTimer) {
    retryTimer = setInterval(() => {
      reloadVideo()
    }, 3000)
  }
}

const onVideoLoad = (): void => {
  loadError.value = false
  if (retryTimer) {
    clearInterval(retryTimer)
    retryTimer = null
  }
}

onMounted(() => {

  refreshTimer = setInterval(() => {
    if (!loadError.value) {
      reloadVideo()
    }
  }, 100) // 100ms = 10fps
})

onUnmounted(() => {
  if (retryTimer) clearInterval(retryTimer)
  if (refreshTimer) clearInterval(refreshTimer)
})
</script>

<style scoped>
.video-container {
  width: 100%;
  height: 100%;
  background-color: black;
  position: relative;
  overflow: hidden;
}

.video-stream {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.no-signal {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  background-color: #f8f8f8;
  font-size: 20px;
  flex-direction: column;
}
</style>
