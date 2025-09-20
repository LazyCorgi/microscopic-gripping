<template>
  <v-card class="pa-4 fill-height" elevation="3">
    <!-- 模式切换 -->
    <v-row class="mb-4" justify="center">
      <v-btn-toggle v-model="mode" mandatory>
        <v-btn
          value="move"
          color="primary"
          depressed
          @click="mechMessage(Commands.changeMode('to_csp'))"
          >运动模式</v-btn
        >
        <v-btn
          value="home"
          color="primary"
          depressed
          @click="mechMessage(Commands.changeMode('to_home'))"
          >回程模式</v-btn
        >
      </v-btn-toggle>
    </v-row>

    <!-- 运动模式 -->
    <template v-if="mode === 'move'">
      <!-- 启动/停止 -->
      <v-row class="mb-2" justify="center">
        <v-btn class="ma-2" color="success" @click="handleMove('start')">启动</v-btn>
        <v-btn class="ma-2" color="error" @click="handleMove('stop')">停止</v-btn>
      </v-row>

      <!-- 通道选择和参数 -->
      <v-row class="mb-2" align="center" justify="start">
        <v-select
          v-model="selectedChannel"
          :items="channelOptions"
          item-title="title"
          item-value="value"
          label="Index"
          dense
          style="max-width: 200px"
        />
      </v-row>

      <!-- 参数输入区域 -->
      <v-row dense class="mb-4" justify="center">
        <template v-if="selectedChannel === 0">
          <v-col v-for="n in [1, 2, 3]" :key="n" cols="4">
            <v-text-field
              v-model.number="destinations[n - 1]"
              :label="`坐标${n}`"
              type="number"
              density="compact"
              hide-details
              variant="underlined"
            />
          </v-col>
        </template>

        <template v-else>
          <v-col cols="4">
            <v-text-field
              v-model.number="destinations[selectedChannel - 1]"
              :label="`坐标${selectedChannel}`"
              type="number"
              density="compact"
              hide-details
              variant="underlined"
            />
          </v-col>
        </template>
      </v-row>

      <!-- Read / Shutdown -->
      <v-row justify="center">
        <v-btn class="ma-2" color="info" @click="readStatus">Read</v-btn>
        <v-btn class="ma-2" color="warning" @click="clearFault">清除错误</v-btn>
        <v-btn class="ma-2" color="grey darken-2" @click="shutdown">关机</v-btn>
      </v-row>
    </template>

    <!-- 回程模式 -->
    <template v-else-if="mode === 'home'">
      <v-row justify="center">
        <v-btn class="ma-2" color="success" @click="handleHome('start')">启动</v-btn>
        <v-btn class="ma-2" color="error" @click="handleHome('stop')">停止</v-btn>
      </v-row>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Commands, mechMessage } from '../utils/MechMessage'

type ModeType = 'move' | 'home'
const mode = ref<ModeType>('move')

// 运动模式：控制逻辑
const handleMove = (action: 'start' | 'stop'): void => {
  mechMessage(Commands.changeMode('to_csp'))
  mechMessage(Commands.cspMove(destinations.value as [number, number, number], action))
}

// 回程模式：控制逻辑
const handleHome = (action: 'start' | 'stop'): void => {
  mechMessage(Commands.changeMode('to_home'))
  mechMessage(Commands.home(action))
}

// 下拉选择通道：0-同时控制123，1-通道1，2-通道2，3-通道3
const channelOptions: { title: string; value: number }[] = [
  { title: '全部通道', value: 0 },
  { title: '通道 1', value: 1 },
  { title: '通道 2', value: 2 },
  { title: '通道 3', value: 3 }
]

const selectedChannel = ref<number>(0)
const destinations = ref<[number, number, number]>([0, 0, 0])

// read 和 shutdown 操作
const readStatus = (): void => {
  mechMessage(Commands.readTxPDO(selectedChannel.value))
}

const clearFault = (): void => {
  mechMessage(Commands.clearFault())
}

const shutdown = (): void => {
  mechMessage(Commands.shutdown())
}
</script>

<style scoped>
/* 可选样式优化 */
</style>
