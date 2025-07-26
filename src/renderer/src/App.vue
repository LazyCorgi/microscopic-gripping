<template>
  <v-app>
    <v-container fluid class="pa-0 d-flex flex-column" style="height: 100%">
      <div class="upper d-flex" style="flex: 5; width: 100%">
        <div class="left-panel" style="width: 60%">
          <vision />
        </div>
        <div class="right-panel" style="width: 40%">
          <move-pannel />
        </div>
      </div>
      <div class="lower d-flex flex-column" style="flex: 5; width: 100%; min-height: 0">
        <div class="pa-1 d-flex flex-row" style="height: 40%; width: 100%">
          <div style="flex: 3; height: 100%">
            <press-pannel />
          </div>
          <div style="flex: 4; height: 100%">
            <ai-control-pannel />
          </div>
        </div>
        <div style="height: 60%">
          <log-viewer />
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'
import MovePannel from './components/MovePannel.vue'
import PressPannel from './components/PressPannel.vue'
import LogViewer from './components/LogViewer.vue'
import Vision from './components/VisionPannel.vue'
import AiControlPannel from './components/AiControlPannel.vue'

const logs = ref<string[]>([])
const logContainer = ref<HTMLElement | null>(null)
const maxLines = 10000

function appendLog(msg: string): void {
  logs.value.push(msg)
  if (logs.value.length > maxLines) {
    logs.value.splice(0, logs.value.length - maxLines)
  }

  nextTick(() => {
    const el = logContainer.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

onMounted(() => {
  window.electron.ipcRenderer.on('tcp-data', (_, msg: string) => {
    appendLog(msg)
  })

  window.electron.ipcRenderer.on('tcp-error', (_, msg: string) => {
    appendLog(`[ERROR] ${msg}`)
  })
})
</script>

<style scoped>
.log-text {
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.4;
  color: #333;
}

.log-error {
  color: #d32f2f;
  font-weight: bold;
}

.log-warn {
  color: #f9a825;
}
</style>
