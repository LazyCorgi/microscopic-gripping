<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    <!-- 第一行：两个输入框 -->
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-text-field
          v-model.number="x"
          label="x (%)"
          type="number"
          variant="outlined"
          density="compact"
          hide-details
          min="0"
          max="100"
          @blur="validateX"
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model.number="y"
          label="y (%)"
          type="number"
          variant="outlined"
          density="compact"
          hide-details
          min="0"
          max="100"
          @blur="validateX"
        />
      </v-col>
    </v-row>

    <!-- 第二行：发送按钮 -->
    <v-row align="center" class="mt-2">
      <v-btn color="primary" @click="camMessage(Msg.cammove([x / 100, y / 100]))"> 发送 </v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Msg, camMessage } from '@renderer/utils/CamMessage'

const x = ref<number>(0)
const y = ref<number>(0)

function validateX(): void {
  if (x.value > 100) x.value = 100
  if (x.value < 0) x.value = 0
}
</script>
