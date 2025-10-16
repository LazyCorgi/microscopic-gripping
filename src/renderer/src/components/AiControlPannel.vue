<template>
  <v-card class="d-flex flex-column align-center justify-center fill-height" elevation="2">
    <!-- 启停按钮 -->
    <v-btn
      :color="aiRunning ? 'red' : 'green'"
      class="mb-2"
      style="width: 160px; height: 50px; font-size: 18px"
      @click="toggleAi"
    >
      {{ aiRunning ? '运行中 - 停止' : '启动 AI 模块' }}
    </v-btn>

    <!-- 模型选择 -->
    <v-btn color="primary" variant="outlined" @click="selectModel">
      <v-icon start>mdi-file</v-icon>
      选择 AI 模型
    </v-btn>

    <!-- 选中路径预览 -->
    <div v-if="modelPath" class="text-caption" style="max-width: 300px; word-break: break-all">
      当前模型：{{ modelPath }}
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Msg, aiMessage } from '../utils/AiMessage'
import { Commands, mechMessage } from '@renderer/utils/MechMessage'

const aiRunning = ref<boolean>(false)
const modelPath = ref<string>('')

/** 切换AI状态 */
const toggleAi = (): void => {
  aiRunning.value = !aiRunning.value
  aiMessage(Msg.set(aiRunning.value ? 'start' : 'stop'))
}

/** 打开文件选择器 */
const selectModel = async (): Promise<void> => {
  try {
    const result = await window.electron?.ipcRenderer?.invoke?.('select-model')
    if (result && typeof result === 'string') {
      modelPath.value = result
      aiMessage(Msg.loadModel(result))
    }
  } catch (err) {
    console.warn('模型选择失败', err)
  }
}

onMounted(() => {
  window.electron?.ipcRenderer?.on('ai', (_, msg) => {
    const data = JSON.parse(msg)
    if (data.content === 'ai-move') {
      mechMessage(Commands.cspMove(data.params, 'start'))
    }
  })
})
onUnmounted(() => {
  window.electron?.ipcRenderer?.removeAllListeners('ai')
})
</script>

<style scoped></style>
