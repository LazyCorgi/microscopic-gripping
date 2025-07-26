<template>
  <v-card class="d-flex flex-column align-center justify-center fill-height" elevation="2">
    <!-- 启停按钮 -->
    <v-btn
      :color="aiRunning ? 'red' : 'green'"
      class="mb-4"
      style="width: 200px; height: 60px; font-size: 18px"
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
    <div v-if="modelPath" class="mt-2 text-caption" style="max-width: 300px; word-break: break-all">
      当前模型：{{ modelPath }}
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Commands, sendMessage } from '../utils/message'

const aiRunning = ref<boolean>(false)
const modelPath = ref<string>('')

/** 切换AI状态 */
const toggleAi = (): void => {
  aiRunning.value = !aiRunning.value
  sendMessage(Commands.toggleAi(aiRunning.value))
}

/** 打开文件选择器 */
const selectModel = async (): Promise<void> => {
  try {
    const result = await window.electron?.ipcRenderer?.invoke?.('select-model')
    if (result && typeof result === 'string') {
      modelPath.value = result
      sendMessage(Commands.loadModel(result))
    }
  } catch (err) {
    console.warn('模型选择失败', err)
  }
}
</script>

<style scoped></style>
