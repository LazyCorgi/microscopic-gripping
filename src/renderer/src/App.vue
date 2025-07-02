<template>
  <div class="container">
    <button class="send-btn" @click="sendTime">发送当前时间到 2333</button>
    <p>接收到的内容:</p>
    <pre class="output">{{ received }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const received = ref('等待接收...')

function sendTime(): void {
  window.electronAPI.sendTimeToTcp()
}

onMounted(() => {
  window.electronAPI.startTcpReceiver((msg) => {
    received.value = msg
  })
})
</script>

<style scoped>
.container {
  padding: 40px;
  font-size: 18px;
  font-family: 'Segoe UI', sans-serif;
}

.send-btn {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-btn:hover {
  background-color: #45a049;
}

.output {
  margin-top: 20px;
  color: black;
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 6px;
  white-space: pre-wrap;
}
</style>
