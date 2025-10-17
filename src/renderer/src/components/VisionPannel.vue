<template>
  <div class="video-container" @click="onClick">
    <img
      v-if="!loadError"
      ref="videoRef"
      :src="computedUrl"
      class="video-stream"
      @error="onVideoError"
      @load="onVideoLoad"
    />
    <div v-else class="no-signal">🚫 无信号</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, defineEmits } from 'vue'

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
const emit = defineEmits<{
  (e: 'video-click', payload: { x: number; y: number }): void
}>()
const videoRef = ref<HTMLImageElement | null>(null)
const onClick = (event: MouseEvent): void => {
  if (!videoRef.value) return
  const img = videoRef.value
  const rect = img.getBoundingClientRect()

  // 点击点在容器中的坐标
  const clickX = event.clientX - rect.left
  const clickY = event.clientY - rect.top

  const { naturalWidth, naturalHeight } = img

  // 显示区域的尺寸
  const displayWidth = rect.width
  const displayHeight = rect.height

  // 视频原始比例和显示比例
  const videoAspect = naturalWidth / naturalHeight
  const displayAspect = displayWidth / displayHeight

  let drawWidth, drawHeight, offsetX, offsetY

  // 计算实际绘制的区域（留黑边情况）
  if (displayAspect > videoAspect) {
    // 容器比视频更宽 → 视频被竖直方向撑满
    drawHeight = displayHeight
    drawWidth = displayHeight * videoAspect
    offsetX = (displayWidth - drawWidth) / 2
    offsetY = 0
  } else {
    // 容器比视频更窄 → 视频被水平撑满
    drawWidth = displayWidth
    drawHeight = displayWidth / videoAspect
    offsetX = 0
    offsetY = (displayHeight - drawHeight) / 2
  }

  // 如果点击在留黑边上，忽略
  if (
    clickX < offsetX ||
    clickX > offsetX + drawWidth ||
    clickY < offsetY ||
    clickY > offsetY + drawHeight
  ) {
    // console.log('Clicked outside video area')
    return
  }

  // 相对绘制区域内的位置（0~1）
  const relX = (clickX - offsetX) / drawWidth
  const relY = (clickY - offsetY) / drawHeight

  // 映射到原视频像素
  const pixelX = Math.round(relX * naturalWidth)
  const pixelY = Math.round(relY * naturalHeight)

  emit('video-click', { x: pixelX, y: pixelY })
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
  user-select: none;
  pointer-events: none;
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
