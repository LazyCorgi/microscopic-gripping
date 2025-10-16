<template>
  <v-app>
    <v-app-bar app flat color="primary" dark>
      <v-toolbar-title class="middle">全自动细胞提取系统</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="openConfig = !openConfig">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>
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
            <CamControlPannel />
          </div>
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

    <ConfigPannel v-model="openConfig" />
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, ref, provide } from 'vue'
import ConfigPannel from './components/ConfigPannel.vue'
import MovePannel from './components/MovePannel.vue'
import PressPannel from './components/PressPannel.vue'
import LogViewer from './components/LogViewer.vue'
import Vision from './components/VisionPannel.vue'
import AiControlPannel from './components/AiControlPannel.vue'
import CamControlPannel from './components/CamControlPannel.vue'

const openConfig = ref(false)

const testMode = ref<boolean>(false)
const Kvalue = ref<number>(1)
provide('testMode', testMode)
provide('Kvalue', Kvalue)
onMounted(async () => {
  const savedk = await window.config.get('move_k')
  if (typeof savedk === 'number') Kvalue.value = savedk
  const savedm = await window.config.get('testmode')
  if (typeof savedm === 'boolean') testMode.value = savedm
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
