<template>
  <v-card class="pa-2 d-flex flex-column fill-height position-relative" elevation="2">
    <!-- 控制按钮 -->
    <div class="log-controls">
      <v-btn icon size="small" variant="text" @click="scrollToTop">
        <v-icon>mdi-arrow-collapse-up</v-icon>
      </v-btn>
      <v-btn icon size="small" variant="text" @click="clearLogs">
        <v-icon color="red">mdi-trash-can</v-icon>
      </v-btn>
    </div>

    <!-- 日志显示区域 -->
    <div ref="logContainer" class="log-container" @scroll.passive="handleScroll">
      <div v-for="entry in logs" :key="entry.id" :class="['log-line', logLevelClass(entry.level)]">
        <span class="log-content">{{ entry.text }}</span>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import '@mdi/font/css/materialdesignicons.css'

type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  id: number
  text: string
  level: LogLevel
}

const MAX_LINES = 10000
const logs = ref<LogEntry[]>([])
let logId = 0
const logContainer = ref<HTMLElement | null>(null)

const appendLog = (text: string, level: LogLevel = 'info'): void => {
  let time = new Date().toLocaleString()
  text = `[${time}] ${text}`
  logs.value.unshift({ id: logId++, text, level })
  if (logs.value.length > MAX_LINES) logs.value.splice(MAX_LINES)
}

const scrollToTop = (): void => {
  logContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearLogs = (): void => {
  logs.value = []
}

const logLevelClass = (level: LogLevel): string =>
  ({
    info: 'log-info',
    warn: 'log-warn',
    error: 'log-error'
  })[level]

const handleScroll = (): void => {
  // 可拓展滚动相关逻辑
}

onMounted(() => {
  const channels = ['mech', 'ai', 'cam']

  for (const ch of channels) {
    window.electron?.ipcRenderer?.on(ch, (_, msg) => {
      appendLog(`[${ch}] ${msg}`, 'info')
    })
  }
})

onUnmounted(() => {
  const channels = ['mech', 'ai', 'cam']
  for (const ch of channels) {
    window.electron?.ipcRenderer?.removeAllListeners(ch)
  }
})
</script>

<style scoped>
/* log-container 现在正确限制在 v-card 内部 */
.log-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 48px;
  overflow-y: auto;
  padding: 12px 8px 8px 8px;
  box-sizing: border-box;
}

.log-controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 10;
}

/* 样式示例，可根据需要修改 */
.log-line {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  padding: 2px 0;
}

.log-info {
  color: #222222;
}

.log-warn {
  color: #ff9800;
}

.log-error {
  color: #f44336;
}
</style>
