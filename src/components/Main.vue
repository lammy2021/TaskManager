<template>
  <div class="main">
    <el-container>
      <el-header>
        <div class="title-container left-margin">
          <img src="../images/cloud.png" alt="logo" class="logo image-size">
          <h1>任务收集盒子</h1>
          <p>让任务收集便捷，快速，有序！</p>
          <el-input v-model="taskId" placeholder="填写任务编号" class="input-task-id narrow-input"></el-input>
          <el-button type="primary" plain class="input-button">进入收集页面</el-button>
        </div>
        <div class="user-prompt">
          <!-- 用户提示信息 -->
          <p>如果任务发起者仅提供了任务编号</p>
          <p>请填写任务编号并点击进入收集页面</p>
          <p>有问题请联系任务发布者处理</p>
          <p>严禁将本服务用于违法用途，后果自负</p>
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

<script>
import { ElContainer, ElHeader, ElInput, ElButton, ElFooter} from 'element-plus';

export default {
  name: 'MainPage',
  components: {
    ElContainer,
    ElHeader,
    ElInput,
    ElButton,
    ElFooter
  },
  data() {
    return {
      taskId: ''
    };
  }
}
</script>

<style scoped>
@import "../styles/main.css";
</style>