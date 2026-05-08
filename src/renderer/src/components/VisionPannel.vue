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
  <div v-if="cali_x || cali_y" style="color: red">[WARN] 正在进行校准</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, inject, type Ref } from 'vue'
import { camMessage, Msg, currentX, currentY } from '@renderer/utils/CamMessage'

const baseUrl = 'http://127.0.0.1:8080/video' // 你的 MJPEG 服务
const loadError = ref(false)
let retryTimer: ReturnType<typeof setInterval> | null = null
let refreshTimer: ReturnType<typeof setInterval> | null = null

const computedUrl = computed(() => `${baseUrl}?t=${Date.now()}`)

const cali_x = inject('cali_x') as Ref<boolean>
const cali_y = inject('cali_y') as Ref<boolean>
const cam_x = inject('cam_x') as Ref<number>
const cam_y = inject('cam_y') as Ref<number>

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
  const relX = (clickX - offsetX) / drawWidth - 0.5
  const relY = (clickY - offsetY) / drawHeight - 0.5

  // 映射到原视频像素
  const pixelX = Math.round(relX * naturalWidth)
  const pixelY = Math.round(relY * naturalHeight)

  const targetX = pixelX + currentX.value
  const targetY = -(pixelY + currentY.value)

  if (!cali_x.value && !cali_y.value) {
    camMessage(
      Msg.cammove(
        Math.round((targetX / cam_x.value) * 100),
        Math.round((targetY / cam_y.value) * 100)
      )
    )
  } else {
    if (cali_x.value) saveCaliX(targetX)
    if (cali_y.value) saveCaliY(targetY)
    camMessage(Msg.camhome())
  }
}

async function saveCaliX(targetX): Promise<void> {
  cam_x.value = targetX
  await window.config.set('cam_x', cam_x.value)
  cali_x.value = false
}

async function saveCaliY(targetY): Promise<void> {
  cam_y.value = targetY
  await window.config.set('cam_y', cam_y.value)
  cali_y.value = false
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
