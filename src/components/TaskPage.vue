<template>
  <div class="main">
    <el-container>
      <el-header>
        <div class="title-container left-margin">
          <img src="../images/cloud.png" alt="logo" class="logo image-size">
          <h1>任务收集盒子</h1>
          <p>让任务收集便捷，快速，有序！</p>
        </div>
        <div v-if="loading" class="loading-message">
          <el-spinner type="circle" size="large"></el-spinner>
          <p>加载任务信息中...</p>
        </div>
        <div class="task-details" v-else-if="task">
          <el-table :data="[task]" class="wider-table">
            <el-table-column label="任务信息">
              <template #default="scope">
                <el-row>
                  <el-col :span="12">开始时间:</el-col>
                  <el-col :span="12">{{ scope.row.startTime }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">结束时间:</el-col>
                  <el-col :span="12">{{ scope.row.endTime }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">发布者:</el-col>
                  <el-col :span="12">{{ scope.row.publisher }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">简要:</el-col>
                  <el-col :span="12">{{ scope.row.summary }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">文件类型:</el-col>
                  <el-col :span="12">{{ scope.row.fileTypes }}</el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <p></p>
          <el-input v-model="studentId" placeholder="填写学号" class="input-student-id narrow-input"></el-input>
          <el-button type="primary" plain @click="submitStudentId" class="input-button">提交</el-button>
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
import { ElContainer, ElHeader, ElInput, ElButton, ElFooter, ElLoading, ElSpinner, ElTable, ElTableColumn, ElRow, ElCol } from 'element-plus';
import axios from 'axios';

export default {
  name: 'MainPage',
  components: {
    ElContainer,
    ElHeader,
    ElInput,
    ElButton,
    ElFooter,
    ElSpinner,
    ElTable,
    ElTableColumn,
    ElRow,
    ElCol
  },
  data() {
    return {
      task: null,
      studentId: '',
      loading: false,
      loadingInstance: null
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskid');
    if (taskId) {
      this.fetchTaskDetails(taskId);
    }
  },
  methods: {
    async fetchTaskDetails(taskId) {
      this.loading = true;
      this.loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.body // Add body modifier
      });

      if (taskId === '1') {
        // Set test data for taskId 1
        this.task = {
          startTime: '2024-01-01 08:00',
          endTime: '2024-01-01 17:00',
          publisher: '测试发布者',
          summary: '这是一个测试任务，测试任务需要收集一下你们的数学作业，请提交docx或者pdf文件，请按照要求的格式上传文件，否则拒收。',
          fileTypes: 'PDF, DOCX'
        };
        this.loadingInstance.close();
        this.loading = false;
      } else {
        try {
          const response = await axios.get(`/api/tasks/${taskId}`);
          this.task = response.data;
        } catch (error) {
          console.error('Error fetching task details:', error);
        } finally {
          this.loadingInstance.close();
          this.loading = false;
        }
      }
    },
    submitStudentId() {
      // Handle student ID submission logic here
      console.log('Student ID submitted:', this.studentId);
    }
  }
}
</script>

<style scoped>
@import "../style/main.css";

</style>