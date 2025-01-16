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
          <p>加载任务信息中...</p>
        </div>
        <div v-else-if="error" class="error-message">
          <div class="user-prompt">
            <el-col>
              <el-result
                icon="error"
                title="错误"
                sub-title="加载任务失败，可能是任务ID输错或者服务端崩溃"
              >
                <template #extra>
                  <el-button type="primary" plain @click="goToHomePage">返回主页</el-button>
                </template>
              </el-result>
            </el-col>
          </div>
        </div>
        <div class="task-details" v-else-if="task">
          <el-descriptions class="task-descriptions" border title="任务详情">
            <el-descriptions-item label="开始时间">{{ formatTime(task.startTime) }}</el-descriptions-item>
            <el-descriptions-item label="结束时间">{{ formatTime(task.endTime) }}</el-descriptions-item>
            <el-descriptions-item label="发布者">{{ task.publisher.username }}</el-descriptions-item>
            <el-descriptions-item label="简要">{{ task.summary }}</el-descriptions-item>
            <el-descriptions-item label="文件类型">
              <el-tag
                v-for="fileType in task.fileFormat.split(',')"
                :key="fileType"
                type="primary"
                effect="plain"
                class="file-type-tag"
              >
                {{ fileType }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <p></p>
          <div v-if="task.status !== 'STOPPED' && !isTaskEnded" class="file-upload">
            <h3>文件收集区域</h3>
            <el-upload
                class="upload-demo"
                drag
                :action="uploadUrl"
                multiple
                :before-upload="beforeUpload"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :on-change="handleFileChange"
                :file-list="fileList"
                :data="uploadData"
                :auto-upload="false"
                ref="upload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <el-input v-model="studentId" placeholder="填写学号" class="input-student-id narrow-input"></el-input>
            <el-button type="primary" plain @click="submitStudentId" class="input-button">提交</el-button>
          </div>
          <div v-else class="collection-stopped">
            <el-alert
              title="收集已停止"
              type="error"
              show-icon
              center
              :closable="false"
            />
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
  ElDescriptions,
  ElDescriptionsItem,
  ElUpload,
  ElResult,
  ElCol,
  ElAlert,
  ElTag
} from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'TaskPage',
  components: {
    ElContainer,
    ElHeader,
    ElInput,
    ElButton,
    ElDescriptions,
    ElDescriptionsItem,
    ElUpload,
    ElResult,
    ElCol,
    ElAlert,
    ElTag
  },
  data() {
    return {
      task: null,
      studentId: '',
      loading: false,
      loadingInstance: null,
      fileList: [],
      error: false
    };
  },
  setup() {
    const router = useRouter();
    const goToHomePage = () => {
      router.push('/');
    };
    return {
      goToHomePage
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

      try {
        const response = await axios.get(`/api/task/info`, { params: { taskid: taskId } });
        if (response.data.status === 'success') {
          this.task = response.data.task;
        } else {
          this.error = true;
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
        this.error = true;
      } finally {
        this.loadingInstance.close();
        this.loading = false;
      }
    },
    formatTime(time) {
      return time.replace('T', ' ');
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
    async submitStudentId() {

      let taskId = this.$route.query.taskid;
      this.task.id=taskId;

      console.log('Student ID:', this.studentId);
      console.log('File List:', this.fileList);
      console.log('Task ID:', this.task ? this.task.id : 'No task');

      if (this.studentId && this.fileList.length > 0 && this.task) {
        const formData = new FormData();
        formData.append('file', this.fileList[0].raw);
        formData.append('taskId', this.task.id);
        formData.append('studentNumber', this.studentId);

        try {
          const response = await axios.post('/api/task/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          if (response.data.status === 'success') {
            this.$message.success('File uploaded successfully');
          } else {
            this.$message.error('File upload failed');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          this.$message.error('File upload failed');
        }
      } else {
        this.$message.error('Please fill in the student number and select a file');
      }
    },
    beforeUpload(file) {
      const allowedFileTypes = this.task.fileFormat.split(',').map(type => type.trim().toLowerCase());
      const fileType = file.name.split('.').pop().toLowerCase();
      const isValidFormat = allowedFileTypes.includes(fileType);
      if (!isValidFormat) {
        this.$message.error(`文件格式必须是: ${allowedFileTypes.join(', ')}`);
      }
      return isValidFormat;
    },
    handleUploadSuccess() {
      this.$message.success('文件上传成功');
    },
    handleUploadError() {
      this.$message.error('文件上传失败');
    }
  },
  computed: {
    isTaskEnded() {
      return new Date() > new Date(this.task.endTime);
    }
  }
}
</script>

<style scoped>
@import "../styles/main.css";

.file-type-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>