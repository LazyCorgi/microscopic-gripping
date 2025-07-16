<template>
  <v-app>
    <v-container fluid class="fill-height pa-0 d-flex flex-column">
      <!-- 控制区 -->
      <v-container fluid class="flex-grow-1 overflow-auto pa-4">
        <v-row>
          <!-- 运动控制 -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>运动平台指令</v-card-title>
              <v-card-text>
                <v-btn class="ma-2" @click="send(Commands.clearFault())">清除故障</v-btn>

                <v-row class="ma-2" align="center">
                  <v-col cols="6">
                    <v-select label="选择从站编号" :items="[1, 2, 3]" v-model="txpdoIndex" dense hide-details />
                  </v-col>
                  <v-col cols="6">
                    <v-btn class="ma-0" @click="send(Commands.readTxPDO(txpdoIndex))">
                      读取从站参数
                    </v-btn>
                  </v-col>
                </v-row>

                <v-btn class="ma-2" @click="send(Commands.shutdown())">关闭控制线程</v-btn>
                <v-btn class="ma-2" @click="send(Commands.changeMode('to_home'))">切换到回原点</v-btn>
                <v-btn class="ma-2" @click="send(Commands.changeMode('to_csp'))">切换到CSP模式</v-btn>
                <v-btn class="ma-2" @click="send(Commands.home('start'))">回原点开始</v-btn>
                <v-btn class="ma-2" @click="send(Commands.home('stop'))">回原点停止</v-btn>
                <v-btn class="ma-2" @click="send(Commands.cspMove([1200, 2100, -1000], 'start'))">
                  运动到目标
                </v-btn>
                <v-btn class="ma-2" @click="send(Commands.cspMove([1200, 2100, -1000], 'stop'))">
                  运动急停
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 泵控制器 -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>泵控制器指令</v-card-title>
              <v-card-text>
                <v-btn class="ma-2" @click="send(Commands.setPressure(4, -88))">
                  设置通道4压强 -88mbar
                </v-btn>
                <v-btn class="ma-2" @click="send(Commands.setPressure(4, 0))">
                  设置通道4压强 0mbar
                </v-btn>
                <v-btn class="ma-2" @click="send(Commands.readPressure())">读取压强</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- 串口监视器区域 -->
      <v-card elevation="2" class="pa-0" style="height: 300px;width: 100%; overflow: hidden;">
        <v-btn text small color="red" @click="clearLogs">清空</v-btn>
        <v-divider></v-divider>
        <v-card-text ref="logContainer" style="padding: 0; overflow-y: auto; height: calc(100% - 40px);">
          <pre class="ma-2 log-text">
<span v-for="(line, index) in logs" :key="index" :class="getLineClass(line)">
  {{ line }}
</span>
          </pre>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'
import { Commands, sendMessage as send } from './utils/message'

const logs = ref<string[]>([])
const logContainer = ref<HTMLElement | null>(null)
const maxLines = 10000
const txpdoIndex = ref(1)

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

function clearLogs(): void {
  logs.value = []
}

function getLineClass(line: string): string {
  if (line.includes('[ERROR]')) return 'log-error'
  if (line.includes('[WARN]')) return 'log-warn'
  return ''
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
