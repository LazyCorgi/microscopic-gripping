<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    <!-- 第一行：两个输入框 -->
    <v-row align="center" justify="center">
      <v-col cols="4">
        <v-text-field
          v-model.number="x"
          label="x (%)"
          type="number"
          step="1"
          variant="outlined"
          density="compact"
          hide-details
          min="0"
          max="100"
          @blur="validateX"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="y"
          label="y (%)"
          type="number"
          step="1"
          variant="outlined"
          density="compact"
          hide-details
          min="0"
          max="100"
          @blur="validateY"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="z"
          label="z (μm)"
          type="number"
          variant="outlined"
          density="compact"
          hide-details
          min="0"
          @blur="validateZ"
        />
      </v-col>
    </v-row>

    <!-- 第二行：发送按钮 -->
    <v-row align="center" class="mt-2">
      <v-btn color="primary" class="mr-2" @click="camMessage(Msg.cammove(x, y))"> 发送 </v-btn>
      <v-btn color="grey" class="mr-2" @click="camMessage(Msg.camhome())"> 回原点 </v-btn>
      <v-btn color="warning" @click="camMessage(Msg.camfocus(z))"> 对焦 </v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Msg, camMessage } from '@renderer/utils/CamMessage'

const x = ref<number>(0)
const y = ref<number>(0)
const z = ref<number>(0)

function validateX(): void {
  x.value = Math.round(x.value)
  // if (x.value > 100) x.value = 100
  if (x.value < 0) x.value = 0
}

function validateY(): void {
  y.value = Math.round(y.value)
  // if (y.value > 100) y.value = 100
  if (y.value < 0) y.value = 0
}

function validateZ(): void {
  if (z.value < 0) z.value = 0
}

onMounted(() => {
  camMessage(Msg.camhome())
})
</script>
