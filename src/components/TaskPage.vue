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
          <el-descriptions class="task-descriptions" border title="任务详情">
            <el-descriptions-item label="开始时间">{{ task.startTime }}</el-descriptions-item>
            <el-descriptions-item label="结束时间">{{ task.endTime }}</el-descriptions-item>
            <el-descriptions-item label="发布者">{{ task.publisher }}</el-descriptions-item>
            <el-descriptions-item label="简要">{{ task.summary }}</el-descriptions-item>
            <el-descriptions-item label="文件类型">{{ task.fileTypes }}</el-descriptions-item>
          </el-descriptions>
          <p></p>
          <div class="file-upload">
            <h3>文件收集区域</h3>
            <el-upload
                class="upload-demo"
                drag
                :action="uploadUrl"
                multiple
                :before-upload="beforeUpload"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :file-list="fileList"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <el-input v-model="studentId" placeholder="填写学号" class="input-student-id narrow-input"></el-input>
            <el-button type="primary" plain @click="submitStudentId" class="input-button">提交</el-button>
          </div>
        </div>
      </el-header>
    </el-container>
  </div>
</template>

<script>
import {
  ElContainer,
  ElHeader,
  ElInput,
  ElButton,
  ElLoading,
  ElSpinner,
  ElDescriptions,
  ElDescriptionsItem,
  ElUpload
} from 'element-plus';
import axios from 'axios';

export default {
  name: 'MainPage',
  components: {
    ElContainer,
    ElHeader,
    ElInput,
    ElButton,
    ElSpinner,
    ElDescriptions,
    ElDescriptionsItem,
    ElUpload
  },
  data() {
    return {
      task: null,
      studentId: '',
      loading: false,
      loadingInstance: null,
      fileList: [],
      uploadUrl: 'https://jsonplaceholder.typicode.com/posts/' // Replace with your actual upload URL
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
        target: document.body
      });

      if (taskId === '1') {
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
      console.log('Student ID submitted:', this.studentId);
    },
    beforeUpload(file) {
      const isValidFormat = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isValidFormat) {
        this.$message.error('文件格式必须是PDF或DOCX');
      }
      return isValidFormat;
    },
    handleUploadSuccess() {
      this.$message.success('文件上传成功');
    },
    handleUploadError() {
      this.$message.error('文件上传失败');
    }
  }
}
</script>


<style scoped>
@import "../styles/main.css";
</style>