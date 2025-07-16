<template>
  <v-container class="pa-4">
    <v-row>
      <!-- 运动平台控制区域 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>运动平台指令</v-card-title>
          <v-card-text>
            <v-btn class="ma-2" @click="send(Commands.clearFault())">清除故障</v-btn>
            <v-row class="ma-2" align="center">
              <v-col cols="6">
                <v-select v-model="txpdoIndex" label="选择从站编号" :items="[1, 2, 3]" dense hide-details />
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

      <!-- 泵控制器控制区域 -->
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Commands, sendMessage as send } from './utils/message'

const txpdoIndex = ref(1)
</script>
