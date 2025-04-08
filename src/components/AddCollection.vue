<template>
  <el-card class="add-collection-card">
    <template #header>
      <div class="card-header">
        <span>添加新任务</span>
      </div>
    </template>
    <el-form :model="form" label-width="120px">
    <el-form-item label="任务开始时间">
      <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择开始时间"
          :default-time="defaultTime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="任务结束时间">
      <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="选择结束时间"
          :default-time="defaultTime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="简要">
      <el-input
          v-model="form.summary"
          placeholder="填写任务简要"
          type="textarea"
          :rows="5"
      ></el-input>
    </el-form-item>
    <el-form-item label="选择文件类型">
      <el-select v-model="form.fileTypes" multiple placeholder="选择文件类型">
        <el-option
            v-for="fileType in fileTypeOptions"
            :key="fileType"
            :label="fileType"
            :value="fileType"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="发布者">
      <el-input v-model="form.publisher.adminId" disabled></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="submitForm">提交</el-button>
    </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElMessage
} from 'element-plus'
import axios from 'axios'
import dayjs from 'dayjs'

const defaultTime = new Date(2000, 0, 1, 0, 0, 0) // 设置默认时间

const form = ref({
  startTime: '',
  endTime: '',
  summary: '',
  fileTypes: [],
  publisher: {
    adminId: 1 // Replace with actual admin ID
  },
  status: 'ACTIVE',
  createdAt: new Date().toISOString()
})

const fileTypeOptions = [
  'docx',
  'doc',
  'xlsx',
  'xls',
  'ppt',
  'pptx',
  'zip',
  '7z',
  'rar',
  'jpg',
  'jpeg',
  'png',
  'mp3',
  'mp4',
  'wmv',
  'wma',
  'flac',
  'txt'
]

const formatDateWithoutTimezone = (dateString) => {
  if (!dateString) return null;
  return dayjs(dateString).format('YYYY-MM-DDTHH:mm:ss');
};

const submitForm = async () => {
  try {
    const payload = {
      startTime: formatDateWithoutTimezone(form.value.startTime),
      endTime: formatDateWithoutTimezone(form.value.endTime),
      summary: form.value.summary,
      fileFormat: form.value.fileTypes.join(','),
      publisher: form.value.publisher,
      status: form.value.status,
      createdAt: formatDateWithoutTimezone(new Date())
    }

    console.log('Payload:', payload); // 用于调试

    const response = await axios.post('/api/admin/task/add', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      ElMessage.success('任务添加成功')
    } else {
      ElMessage.error('任务添加失败')
    }
  } catch (error) {
    console.error('任务添加请求失败:', error)
    ElMessage.error('任务添加请求失败，请检查网络或联系管理员')
  }
}
</script>

<style scoped>
.add-collection-card {
  max-width: 800px; /* Limit form width for better readability on wider screens */
  margin: 30px auto; /* Center the card and add top/bottom margin */
  padding: 25px; /* Add padding inside the card */
  border-radius: 8px; /* Slightly round the corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
}

.card-header {
  font-size: 1.3em; /* Increase title font size */
  font-weight: 600; /* Make title slightly bolder */
  color: #303133; /* Darker text color for title */
  border-bottom: 1px solid #ebeef5; /* Add a separator line below header */
  padding-bottom: 15px; /* Space below header text */
  margin-bottom: 20px; /* Space between header and form */
}

.el-form-item {
  margin-bottom: 25px; /* Increase spacing between form items */
}

/* Ensure labels are aligned properly */
.el-form-item__label {
  color: #606266; /* Standard label color */
}

/* Style inputs for consistency */
.el-input, .el-select, .el-date-picker {
  width: 100%; /* Make form controls full width */
}

/* Style the submit button */
.el-form-item:last-child {
  margin-bottom: 0; /* Remove margin below the last item (button) */
  text-align: right; /* Align button to the right */
}

.el-button--primary.is-plain {
  /* Customize plain primary button if needed */
}
</style>
