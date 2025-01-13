<!-- src/components/MainPage.vue -->
<template>
  <div class="main">
    <el-container>
      <el-header>
        <div class="title-container left-margin">
          <img src="../images/cloud.png" alt="logo" class="logo image-size">
          <h1>任务收集盒子</h1>
          <p>让任务收集便捷，快速，有序！</p>
          <el-input v-model="taskId" placeholder="填写任务编号" class="input-task-id narrow-input"></el-input>
          <el-button type="primary" plain class="input-button" @click="goToTaskPage">进入收集页面</el-button>
        </div>
        <div class="user-prompt">
          <p>如果任务发起者提供了任务编号</p>
          <p>请填写任务编号并点击进入收集页面</p>
          <p>有问题请联系任务发布者处理</p>
        </div>
      </el-header>
      <el-footer>
        <div class="footer-content">
          © 2024 任务收集盒子. Powered by Lammy
          <a href="/admin" class="admin-link">后台管理</a>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElContainer, ElHeader, ElInput, ElButton, ElFooter } from 'element-plus';

const taskId = ref('');
const router = useRouter();

const goToTaskPage = () => {
  if (taskId.value) {
    router.push({ path: '/task-page', query: { taskid: taskId.value } });
  }
};
</script>

<style scoped>
@import "../styles/main.css";
</style>