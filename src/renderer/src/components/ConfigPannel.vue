<template>
  <!-- 背景遮罩 -->
  <transition name="fade">
    <div v-if="visible" class="settings-overlay" @click.self="close"></div>
  </transition>

  <!-- 右侧悬浮面板 -->
  <transition name="slide">
    <v-card v-if="visible" class="settings-panel" elevation="12">
      <v-card-title>设置</v-card-title>
      <v-card-text>
        <v-switch v-model="testMode" color="primary" label="测试模式(无视K值)" @change="saveMode" />
        <v-text-field v-model.number="Kvalue" label="运动K值" type="number" @change="saveKvalue" />
        <v-btn v-model="cali_x" color="primary" @click="cali_x = !cali_x">{{
          cali_x ? '取消x轴校准' : 'x轴校准'
        }}</v-btn>
        <v-text-field v-model.number="cam_x" label="x轴校准" type="number" @change="saveCali" />
        <v-btn v-model="cali_y" color="primary" @click="cali_y = !cali_y">{{
          cali_y ? '取消y轴校准' : 'y轴校准'
        }}</v-btn>
        <v-text-field v-model.number="cam_y" label="y轴校准" type="number" @change="saveCali" />
      </v-card-text>
    </v-card>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, inject, type Ref } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => (visible.value = val)
)

function close(): void {
  emit('update:modelValue', false)
}

const Kvalue = inject('Kvalue') as Ref<number>
const testMode = inject('testMode') as Ref<boolean>

async function saveKvalue(): Promise<void> {
  await window.config.set('move_k', Kvalue.value)
}
async function saveMode(): Promise<void> {
  await window.config.set('testmode', testMode.value)
}

const cali_x = inject('cali_x') as Ref<boolean>
const cali_y = inject('cali_y') as Ref<boolean>
const cam_x = inject('cam_x') as Ref<number>
const cam_y = inject('cam_y') as Ref<number>

async function saveCali(): Promise<void> {
  await window.config.set('cam_x', cam_x.value)
  await window.config.set('cam_y', cam_y.value)
}
</script>

<style scoped>
/* 背景遮罩 */
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 998;
}

/* 右侧面板 */
.settings-panel {
  position: fixed;
  top: 64px;
  /* 略低于顶部栏 */
  right: 0;
  width: 300px;
  z-index: 999;
  border-radius: 8px 0 0 8px;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 0.3s;
}

.slide-leave-active {
  transition: transform 0.2s;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
