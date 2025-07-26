<template>
  <v-card class="d-flex flex-column align-center justify-center pa-6 fill-height" elevation="3">
    <v-row align="center" justify="center" class="mb-4">
      <v-text-field
        v-model.number="pressure"
        label="目标压强"
        type="number"
        variant="underlined"
        density="compact"
        hide-details
        style="max-width: 200px"
      />
    </v-row>

    <v-row align="center" justify="center">
      <v-text-field
        v-model.number="timeout"
        label="持续时间"
        type="number"
        variant="underlined"
        density="compact"
        hide-details
        style="max-width: 110px"
      />
      <v-btn color="primary" @click="handlePress">设置压强</v-btn>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Commands, sendMessage } from '../utils/message'

const pressure = ref<number>(0)
let timeoutId: number | null = null
let timeout = 5

const handlePress = (): void => {
  if (pressure.value <= -1000 || pressure.value >= 1000) {
    return
  }
  sendMessage(Commands.setPressure(pressure.value))

  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = window.setTimeout(() => {
    sendMessage(Commands.setPressure(0))
    timeoutId = null
  }, timeout * 1000)
}
</script>

<style scoped></style>
