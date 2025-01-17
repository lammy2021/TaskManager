<template>
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
/* Add any custom styles here */
</style>