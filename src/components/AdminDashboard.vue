<!-- src/components/AdminDashboard.vue -->
<template>
  <div>
    <div class="rounded-container">
      <div class="row">
        <div class="col">
          <div class="statistic">
            <div class="title">总用户数量</div>
            <div class="value">{{ totalUsers }}</div>
          </div>
        </div>
        <div class="col">
          <div class="statistic">
            <div class="title">今日收集份数</div>
            <div class="value">{{ todayCollections }}</div>
          </div>
        </div>
        <div class="col">
          <div class="statistic">
            <div class="title">进行中</div>
            <div class="value">{{ ongoingCollections }}</div>
          </div>
        </div>
        <div class="col">
          <div class="statistic">
            <div class="title">已完成</div>
            <div class="value">{{ completedCollections }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const totalUsers = ref(100)
const todayCollections = ref(50)
const ongoingCollections = ref(20)
const completedCollections = ref(30)
</script>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
}

.col {
  flex: 1;
  text-align: center;
  padding: 30px;
}

.statistic {
  font-size: 2em;
}

.title {
  font-size: 0.6em;
  color: #000000;
}

.value {
  font-size: 1em;
  color: #7a7a7a;
}

.rounded-container {
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
}
</style>